import {
  makeContractCall,
  uintCV,
  stringUtf8CV,
  standardPrincipalCV,
  PostConditionMode,
  AnchorMode,
  fetchCallReadOnlyFunction,
  cvToValue,
} from "@stacks/transactions";
import { STACKS_MAINNET } from "@stacks/network";
import { openContractCall } from "@stacks/connect";

export const CONTRACT_ADDRESS = "SP25H46Z9YCAB1TW93YG42WM0SREG9SC5EZB977TJ";
export const CONTRACT_NAME = "crowdfunding";
export const NETWORK = STACKS_MAINNET;

const BASE = {
  contractAddress: CONTRACT_ADDRESS,
  contractName: CONTRACT_NAME,
  network: NETWORK,
  anchorMode: AnchorMode.Any,
  postConditionMode: PostConditionMode.Allow,
};

export async function createCampaign(
  title: string,
  description: string,
  goalMicroStx: number,
  deadline: number,
) {
  await openContractCall({
    ...BASE,
    functionName: "create-campaign",
    functionArgs: [
      stringUtf8CV(title),
      stringUtf8CV(description),
      uintCV(goalMicroStx),
      uintCV(deadline),
    ],
  });
}

export async function fundCampaign(campaignId: number, amountMicroStx: number) {
  await openContractCall({
    ...BASE,
    functionName: "fund",
    functionArgs: [uintCV(campaignId), uintCV(amountMicroStx)],
  });
}

export async function claimFunds(campaignId: number) {
  await openContractCall({
    ...BASE,
    functionName: "claim",
    functionArgs: [uintCV(campaignId)],
  });
}

export async function refund(campaignId: number) {
  await openContractCall({
    ...BASE,
    functionName: "refund",
    functionArgs: [uintCV(campaignId)],
  });
}

export async function getCampaign(id: number) {
  const result = await fetchCallReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "get-campaign",
    functionArgs: [uintCV(id)],
    network: NETWORK,
    senderAddress: CONTRACT_ADDRESS,
  });
  return cvToValue(result, true);
}

export async function getCampaignCount(): Promise<number> {
  const result = await fetchCallReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "get-campaign-count",
    functionArgs: [],
    network: NETWORK,
    senderAddress: CONTRACT_ADDRESS,
  });
  return Number(cvToValue(result, true));
}
