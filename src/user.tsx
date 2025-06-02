import { useEffect, useState } from 'react';

import { Icon28UserOutline } from '@vkontakte/icons';
import { Accordion, Counter, Group, Header } from '@vkontakte/vkui';

import { getCompanies, getUsers, type User } from './shared/firebase';
import { Companies } from './company';
import { useUpdatedContext } from './shared/context';

interface UserProps {
  user: User;
  openId: number | null;
  setOpenId: (id: number | null) => void;
}

const User = ({ user, openId, setOpenId }: UserProps) => {
  const { id, common, name, success, companies = [] } = user;

  return (
  <Accordion
    key={id}
    expanded={openId === id}
    onChange={(e) => (e ? setOpenId(id) : setOpenId(null))}
  >
    <Accordion.Summary
      before={<Icon28UserOutline />}
      indicator={<Total success={success} common={common} />}
    >
      {name}
    </Accordion.Summary>
    <Accordion.Content>
      <Companies userId={openId} companies={companies} />
    </Accordion.Content>
  </Accordion>
  );
};

const Total = ({ success, common }: { success: number; common: number }) => {
  return (
    <Counter mode='primary' appearance={ success > common / 2 ? 'accent-green' : 'accent-red'}>
      {`${success}/${common}`}
    </Counter>
  )
}

export const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { isUpdate } = useUpdatedContext();
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([getUsers(), getCompanies()])
      .then(([users, companies]) => {
        for (const u of users) {
          const userCompanies = companies.filter(c => c.userId === u.userId);
          if (userCompanies) {
            u['companies'] = userCompanies;
          }
        }

        users.sort((a, b) => b.common - a.common);
        setUsers(users);
      });

  }, [isUpdate]);

  if (!users.length) {
    return <div>Loading...</div>;
  }

  return (
    <Group header={<Header size='xl'>Участники</Header>}>
      {users.map((u) => (<User key={u.id} user={u} openId={openId} setOpenId={setOpenId} />))}
    </Group>
  );
};
