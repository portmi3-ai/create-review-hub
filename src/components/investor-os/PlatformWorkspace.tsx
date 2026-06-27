import { getInvestorRoom } from "@/lib/investor-room.functions";
import {
  DataRoomFoldersPanel,
  DiligenceRequestsPanel,
  FounderKpiPanel,
  FundraisingTasksPanel,
  GithubFeedPanel,
  InvestorPipelinePanel,
  InvestorUpdatesPanel,
  ProductSandboxPanel,
} from "./WorkspacePanels";

type RoomData = Awaited<ReturnType<typeof getInvestorRoom>>;

export function PlatformWorkspace({ data, isAdmin }: { data: RoomData; isAdmin: boolean }) {
  return (
    <>
      <FounderKpiPanel items={data.founderKpis} />
      <DataRoomFoldersPanel folders={data.folders} />
      <InvestorUpdatesPanel updates={data.investorUpdates} />
      {isAdmin && <InvestorPipelinePanel investors={data.investors} />}
      {isAdmin && <DiligenceRequestsPanel requests={data.diligenceRequests} />}
      <GithubFeedPanel feed={data.githubFeed} />
      <ProductSandboxPanel items={data.productSandbox} />
      <FundraisingTasksPanel tasks={data.fundraisingTasks} />
    </>
  );
}
