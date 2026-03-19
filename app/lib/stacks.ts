import {
  uintCV,
  stringUtf8CV,
  fetchCallReadOnlyFunction,
  cvToValue,
  cvToHex,
} from "@stacks/transactions";
import { STACKS_MAINNET } from "@stacks/network";

export const CONTRACT_ADDRESS = "SP25H46Z9YCAB1TW93YG42WM0SREG9SC5EZB977TJ";
export const CONTRACT_NAME = "crowdfunding";
export const NETWORK = STACKS_MAINNET;

async function leatherCall(functionName: string, functionArgs: any[]) {
  const leather = (window as any).LeatherProvider;
  if (!leather) throw new Error("Leather wallet not found.");

  return leather.request("stx_callContract", {
    contract: `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`,
    functionName,
    functionArgs: functionArgs.map((cv) => cvToHex(cv)),
    network: "mainnet",
  });
}

export async function createCampaign(
  title: string,
  description: string,
  goalMicroStx: number,
  deadline: number,
) {
  return leatherCall("create-campaign", [
    stringUtf8CV(title),
    stringUtf8CV(description),
    uintCV(goalMicroStx),
    uintCV(deadline),
  ]);
}

export async function fundCampaign(campaignId: number, amountMicroStx: number) {
  return leatherCall("fund", [uintCV(campaignId), uintCV(amountMicroStx)]);
}

export async function claimFunds(campaignId: number) {
  return leatherCall("claim", [uintCV(campaignId)]);
}

export async function refund(campaignId: number) {
  return leatherCall("refund", [uintCV(campaignId)]);
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
