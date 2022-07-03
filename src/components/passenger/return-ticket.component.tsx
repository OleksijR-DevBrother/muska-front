import styles from './css/styles.module.scss';

import { FunctionComponent, useEffect, useState } from 'react';
import axios from 'axios';

import { config } from '../../config';
import { useStoreSelector } from '../../redux/store';

export const ReturnTicket: FunctionComponent = () => {
  const user = useStoreSelector((store) => store.user);

  const [ticketId, setTicketId] = useState('');
  const [tickets, setTickets] = useState([] as any[]);

  const loadTickets = async () => {
    const url = new URL('/tickets/get/list', config.trainsUrl).toString();
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    });

    setTickets(res.data);
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const returnTicketFunction = async (e: any) => {
    e.preventDefault();

    const url = new URL(
      `/tickets/return/${ticketId}`,
      config.trainsUrl,
    ).toString();
    await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    });

    await loadTickets();
  };

  if (tickets.length && !ticketId) {
    setTicketId(tickets[0].id);
  }

  return tickets.length ? (
    <form onSubmit={returnTicketFunction}>
      <div style={{ margin: '10px' }}>
        <select
          style={{ color: 'black', fontSize: 15 }}
          onChange={(e) => setTicketId(e.target.value)}
          value={ticketId}
        >
          {tickets.map((ticket) => (
            <option key={ticket.id} value={ticket.id}>
              {ticket.routeName}
              {' | '}
              {new Date(ticket.departureDateTime).toUTCString()}
            </option>
          ))}
        </select>
      </div>

      <br />
      <br />

      <button type="submit">Return ticket</button>
    </form>
  ) : (
    <h2>You don't have any tickets</h2>
  );
};
