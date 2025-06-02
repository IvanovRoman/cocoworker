import { Icon28Delete, Icon28ThumbsDown, Icon28ThumbsUp } from '@vkontakte/icons';
import { Cell, Div, Flex, List, Text } from '@vkontakte/vkui';

import { Company, deleteCompany } from './shared/firebase';
import { useUpdatedContext } from './shared/context';

interface Props {
  userId?: number | null;
  companies: Company[];
}

export const Companies = ({ userId,  companies}: Props) => {
  const { ownerId, setIsUpdate } = useUpdatedContext();
  
  if (!companies.length) {
    return (
      <Div>
        <Text>Не проходил собеседования</Text>
      </Div>
    );
  }

  const removeCompany = (c: Company) => {
    deleteCompany(c)
      .then(() => {
        setIsUpdate();
      });
  };

  return (
    <Div>
      <List gap={5}>
        {companies.map((c, i) => (
          <Cell
            key={i}
            Component='label'
            indicator={
              <Flex direction='row' gap={5}>
                {c.success ? <Icon28ThumbsUp color='#74cb3f' /> : <Icon28ThumbsDown color='#ed489a' />}
                {ownerId == userId && (
                  <Icon28Delete
                    color='gray'
                    onClick={() => removeCompany(c)}
                  />
                  )}
              </Flex>
            }
          >
            {c.name}
          </Cell>
          ))
        }
      </List>
    </Div>
  );
};
