import {
  IDataReceived,
  IConversation,
  IResponse,
  IDataCreateNewGroup,
  IDataAddNewMember,
  IDataAddNewMemberResponse,
  IDataChangeUsernameOfConversation,
  IDataChangeEmoji,
  IDataChangeNameGroup,
  IDataDeleteMemberResponse,
  IDataDeleteMember,
  IParticipant,
} from '../../ultils/interface';
import myAxios from '../../ultils/myAxios';

export interface IDataConversations {
  conversations: IConversation[];
}

const fetchConversationOfUser = async (userId: string) => {
  const res = (await myAxios.get(
    `/user/conversation/${userId}`
  )) as IDataReceived<IDataConversations>;
  return res.data.metaData;
};

const searchConversationByName = async (
  keyword: string
): Promise<IResponse<IConversation[]>> => {
  const res = await myAxios.get(`/conversation/search?q=${keyword}`);
  return res;
};

const getFirstConversation = async (): Promise<IConversation> => {
  const res = await myAxios.get(`/conversation/first`);
  return res.data.metaData;
};

const createNewGroup = async (data: IDataCreateNewGroup) => {
  return await myAxios.post('/conversation', data);
};

const handleAddNewMember = async (
  data: IDataAddNewMember
): Promise<IDataAddNewMemberResponse> => {
  const res = await myAxios.post('/conversation/group/participant/add', data);
  return res.data.metaData;
};

const handleDeleteMember = async (
  data: IDataDeleteMember
): Promise<IResponse<IDataDeleteMemberResponse>> => {
  const res = await myAxios.patch(
    '/conversation/group/participant/delele',
    data
  );
  return res;
};

const handlePromotedAdmin = async (
  data: IDataDeleteMember
): Promise<{
  participant: IParticipant;
  conversation: IConversation;
}> => {
  const res = await myAxios.patch(
    '/conversation/group/participant/promoted',
    data
  );
  return res.data.metaData;
};

const handleChangeUsername = async (
  data: IDataChangeUsernameOfConversation
): Promise<IDataChangeUsernameOfConversation> => {
  const res = await myAxios.patch('/conversation/change-username', data);
  return res.data.metaData;
};

const handleChangeEmoji = async (
  data: IDataChangeEmoji
): Promise<IConversation> => {
  const res = await myAxios.patch('/conversation/change-emoji', data);
  return res.data.metaData;
};

const handleChangeAvatarOfGroup = async (
  data: FormData
): Promise<IConversation> => {
  const res = await myAxios.patch('/conversation/change-avatar-group', data);
  return res.data.metaData;
};

const handleChangeNameOfGroup = async (
  data: IDataChangeNameGroup
): Promise<IResponse<IConversation>> => {
  const res = await myAxios.patch('/conversation/change-name-group', data);
  return res;
};

export const conversationService = {
  fetchConversationOfUser,
  searchConversationByName,
  getFirstConversation,
  createNewGroup,
  handleAddNewMember,
  handlePromotedAdmin,
  handleDeleteMember,
  handleChangeUsername,
  handleChangeEmoji,
  handleChangeAvatarOfGroup,
  handleChangeNameOfGroup,
};
