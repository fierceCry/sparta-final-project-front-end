export const mockChatData = [
  {
    id: 1,
    senderId: 1, // 잡일 등록자 ID
    receiverId: 2, // 잡일 수락자 ID
    chatRoomsId: 1, // 채팅방 ID
    content: "수락자 님께서 해주시면 좋을 것 같아요. 시간은 제시해 드린대로 00시 00분 까지 00로 10 00빌딩 앞에서 뵈면 좋겠어요.",
    createdAt: new Date('2023-07-01T10:00:00Z'), // 생성일
    updatedAt: new Date('2023-07-01T10:00:00Z'), // 수정일
    deletedAt: null, // 삭제일
  },
  {
    id: 2,
    senderId: 2,
    receiverId: 1,
    chatRoomsId: 1,
    content: "네 알겠습니다.",
    createdAt: new Date('2023-07-01T10:05:00Z'),
    updatedAt: new Date('2023-07-01T10:05:00Z'),
    deletedAt: null,
  },
  {
    id: 3,
    senderId: 1,
    receiverId: 2,
    chatRoomsId: 1,
    content: "최송한데 7000원에 하겠다는 분이 생겨서 없던 일로 하겠습니다.",
    createdAt: new Date('2023-07-01T10:10:00Z'),
    updatedAt: new Date('2023-07-01T10:10:00Z'),
    deletedAt: null,
  },
  {
    id: 4,
    senderId: 2,
    receiverId: 1,
    chatRoomsId: 1,
    content: "얼.. 아쉽네요.. 수고요",
    createdAt: new Date('2023-07-01T10:15:00Z'),
    updatedAt: new Date('2023-07-01T10:15:00Z'),
    deletedAt: null,
  },
];
