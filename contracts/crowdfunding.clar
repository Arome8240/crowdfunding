;; Crowdfunding contract on Stacks

(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-already-funded (err u102))
(define-constant err-goal-not-reached (err u103))
(define-constant err-deadline-passed (err u104))
(define-constant err-deadline-not-passed (err u105))
(define-constant err-already-claimed (err u106))

(define-data-var campaign-count uint u0)

(define-map campaigns
  { id: uint }
  {
    creator: principal,
    title: (string-utf8 100),
    description: (string-utf8 500),
    goal: uint,
    raised: uint,
    deadline: uint,
    claimed: bool
  }
)

(define-map contributions
  { campaign-id: uint, contributor: principal }
  { amount: uint }
)

(define-public (create-campaign (title (string-utf8 100)) (description (string-utf8 500)) (goal uint) (deadline uint))
  (let ((id (+ (var-get campaign-count) u1)))
    (asserts! (> deadline block-height) err-deadline-passed)
    (map-set campaigns { id: id }
      { creator: tx-sender, title: title, description: description,
        goal: goal, raised: u0, deadline: deadline, claimed: false })
    (var-set campaign-count id)
    (ok id)
  )
)

(define-public (fund (campaign-id uint) (amount uint))
  (let (
    (campaign (unwrap! (map-get? campaigns { id: campaign-id }) err-not-found))
    (existing (default-to { amount: u0 } (map-get? contributions { campaign-id: campaign-id, contributor: tx-sender })))
  )
    (asserts! (<= block-height (get deadline campaign)) err-deadline-passed)
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    (map-set contributions { campaign-id: campaign-id, contributor: tx-sender }
      { amount: (+ (get amount existing) amount) })
    (map-set campaigns { id: campaign-id }
      (merge campaign { raised: (+ (get raised campaign) amount) }))
    (ok true)
  )
)

(define-public (claim (campaign-id uint))
  (let ((campaign (unwrap! (map-get? campaigns { id: campaign-id }) err-not-found)))
    (asserts! (is-eq tx-sender (get creator campaign)) err-owner-only)
    (asserts! (>= (get raised campaign) (get goal campaign)) err-goal-not-reached)
    (asserts! (not (get claimed campaign)) err-already-claimed)
    (try! (as-contract (stx-transfer? (get raised campaign) tx-sender (get creator campaign))))
    (map-set campaigns { id: campaign-id } (merge campaign { claimed: true }))
    (ok true)
  )
)

(define-public (refund (campaign-id uint))
  (let (
    (campaign (unwrap! (map-get? campaigns { id: campaign-id }) err-not-found))
    (contribution (unwrap! (map-get? contributions { campaign-id: campaign-id, contributor: tx-sender }) err-not-found))
  )
    (asserts! (> block-height (get deadline campaign)) err-deadline-not-passed)
    (asserts! (< (get raised campaign) (get goal campaign)) err-goal-not-reached)
    (try! (as-contract (stx-transfer? (get amount contribution) tx-sender tx-sender)))
    (map-delete contributions { campaign-id: campaign-id, contributor: tx-sender })
    (ok true)
  )
)

(define-read-only (get-campaign (id uint))
  (map-get? campaigns { id: id })
)

(define-read-only (get-contribution (campaign-id uint) (contributor principal))
  (map-get? contributions { campaign-id: campaign-id, contributor: contributor })
)

(define-read-only (get-campaign-count)
  (var-get campaign-count)
)
