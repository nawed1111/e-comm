import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const TicketShow = ({ ticket, user }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`),
  });

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      {errors}
      {user.id !== ticket.userId ? (
        <button onClick={() => doRequest()} className="btn btn-primary">
          Purchase
        </button>
      ) : (
        ''
      )}
    </div>
  );
};

TicketShow.getInitialProps = async (context, client, user) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data, user };
};

export default TicketShow;
