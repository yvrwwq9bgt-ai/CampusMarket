export type Notification = {
  id: string;
  recipientId: string;
  productId: string;
  actorId: string;
  actorName: string;
  type: "purchase_interest";
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
};
