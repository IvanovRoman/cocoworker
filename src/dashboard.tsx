import { useState, useRef } from 'react';
import { ModalRoot, ModalPage, ModalPageHeader, Group, Panel, PanelHeader, Avatar, Button, Separator, SplitLayout, Div, Flex, Input, IconButton, FormItem, FormLayoutGroup, Checkbox } from '@vkontakte/vkui';
import { Icon16Clear } from '@vkontakte/icons';
import { UserList } from './user';

import { addCompany } from './shared/firebase';
import { useUpdatedContext } from './shared/context';

import pict from './assets/djangounchained.jpg';

const LABEL = 'Добавить компанию, куда собеседуешься';

export const Main = () => {
  const [modal, showModal] = useState<null | string>(null);
  const { setIsUpdate, ownerId } = useUpdatedContext();

  const checkboxInput = useRef<HTMLInputElement>(null);
  const textInput = useRef<HTMLInputElement>(null);
  const clear = () => {
    if (textInput.current) {
      textInput.current.value = '';
      textInput.current.focus();
    }
  };

  const modalRoot = (
    <ModalRoot activeModal={modal}>
      <ModalPage
        id={'modal'}
        onClose={() => showModal(null)}
        header={<ModalPageHeader>{LABEL}</ModalPageHeader>}
        title={LABEL}
      >
        <FormLayoutGroup>
          <FormItem>
            <Input
                getRef={textInput}
                type="text"
                defaultValue="Компания"
                after={
                  <IconButton hoverMode="opacity" label="Очистить поле" onClick={clear}>
                    <Icon16Clear />
                  </IconButton>
                }
              />
          </FormItem>
            <Checkbox getRef={checkboxInput}>
              Предложили оффер
            </Checkbox>
          <FormItem>
            <Button 
              stretched 
              onClick={() => {
                const success = checkboxInput.current?.checked || false;
                const name = textInput.current?.value || '';
                if (!name) {
                  return;
                }

                if (!ownerId) {
                  return;
                }

                addCompany({ userId: ownerId, success, name})
                  .then(() => {
                    showModal(null);
                    setIsUpdate();
                  })
              }}
            >
              Добавить
            </Button>
          </FormItem>
        </FormLayoutGroup>
      </ModalPage>
    </ModalRoot>
  );

  return (
    <SplitLayout center header={<PanelHeader delimiter='none' />}>
      <Panel id={'panel 1'}>
        <PanelHeader>
          <Flex justify='center'>
            <Div>
              Турнир
            </Div>
          </Flex>
        </PanelHeader>
        <Group>
          <Flex margin='auto' direction='column' align='center' justify='center' gap={5}>
            <Avatar size={128} src={pict} />
            <Button onClick={() => showModal('modal')}>{LABEL}</Button>
          </Flex>
          <Separator />
          <UserList />
        </Group>
      </Panel>
      {modalRoot}
    </SplitLayout>
  );
}
