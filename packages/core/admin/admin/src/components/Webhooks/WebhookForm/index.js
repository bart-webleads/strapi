import { Form } from '@strapi/helper-plugin';
import { BackIcon, CheckIcon, Publish } from '@strapi/icons';
import {
  Box,
  Button,
  ContentLayout,
  Grid,
  GridItem,
  HeaderLayout,
  Link,
  Stack,
  TextInput,
} from '@strapi/parts';
import { Field, Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import EventInput from '../EventInput';
import HeadersInput from '../HeadersInput';
import TriggerContainer from '../TriggerContainer';
import schema from '../utils/schema';

const WebhookForm = ({
  handleSubmit,
  data,
  triggerWebhook,
  isCreating,
  isTriggering,
  isTriggerIdle,
  triggerResponse,
  isDraftAndPublishEvents,
}) => {
  const { formatMessage } = useIntl();

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={{
        name: data?.name || '',
        url: data?.url || '',
        headers: Object.keys(data?.headers || []).length
          ? Object.entries(data.headers).map(([key, value]) => ({ key, value }))
          : [{ key: '', value: '' }],
        events: data?.events || [],
      }}
      validationSchema={schema}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({ handleSubmit, errors, handleReset }) => (
        <Form noValidate>
          <HeaderLayout
            id="title"
            primaryAction={
              <Stack horizontal size={2}>
                <Button
                  onClick={triggerWebhook}
                  variant="tertiary"
                  startIcon={<Publish />}
                  disabled={isCreating || isTriggering}
                >
                  {formatMessage({
                    id: 'Settings.webhooks.trigger',
                    defaultMessage: 'Trigger',
                  })}
                </Button>
                <Button variant="secondary" onClick={handleReset}>
                  {formatMessage({
                    id: 'app.components.Button.reset',
                    defaultMessage: 'Reset',
                  })}
                </Button>
                <Button startIcon={<CheckIcon />} onClick={handleSubmit} type="submit">
                  {formatMessage({
                    id: 'app.components.Button.save',
                    defaultMessage: 'Save',
                  })}
                </Button>
              </Stack>
            }
            title={
              isCreating
                ? formatMessage({
                    id: 'Settings.webhooks.create',
                    defaultMessage: 'Create a webhook',
                  })
                : data?.name
            }
            navigationAction={
              <Link startIcon={<BackIcon />} to="/settings/webhooks">
                Go back
              </Link>
            }
            as="h1"
          />
          <ContentLayout>
            <Stack size={4}>
              {(isTriggering || !isTriggerIdle) && (
                <div className="trigger-wrapper">
                  <TriggerContainer
                    isPending={isTriggering}
                    response={triggerResponse}
                    onCancel={triggerResponse?.cancel}
                  />
                </div>
              )}
              <Box background="neutral0" padding={8} shadow="filterShadow" hasRadius>
                <Stack size={6}>
                  <Grid gap={6}>
                    <GridItem col={6}>
                      <Field
                        as={TextInput}
                        name="name"
                        error={errors.name && formatMessage({ id: errors.name })}
                        label={formatMessage({
                          id: 'Settings.webhooks.form.name',
                          defaultMessage: 'Name',
                        })}
                      />
                    </GridItem>
                    <GridItem col={12}>
                      <Field
                        as={TextInput}
                        name="url"
                        error={errors.url && formatMessage({ id: errors.url })}
                        label={formatMessage({
                          id: 'Settings.roles.form.input.url',
                          defaultMessage: 'Url',
                        })}
                      />
                    </GridItem>
                  </Grid>
                  <HeadersInput />
                  <EventInput isDraftAndPublish={isDraftAndPublishEvents} />
                </Stack>
              </Box>
            </Stack>
          </ContentLayout>
        </Form>
      )}
    </Formik>
  );
};

WebhookForm.propTypes = {
  data: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  triggerWebhook: PropTypes.func.isRequired,
  isCreating: PropTypes.bool.isRequired,
  isDraftAndPublishEvents: PropTypes.bool.isRequired,
  isTriggering: PropTypes.bool.isRequired,
  isTriggerIdle: PropTypes.bool.isRequired,
  triggerResponse: PropTypes.object,
};

WebhookForm.defaultProps = {
  data: undefined,
  triggerResponse: undefined,
};

export default WebhookForm;
