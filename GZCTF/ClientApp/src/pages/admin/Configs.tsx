import { FC, useEffect, useState } from 'react'
import { Button, Divider, Group, SimpleGrid, Stack, Switch, TextInput, Title } from '@mantine/core'
import { mdiContentSaveOutline } from '@mdi/js'
import { Icon } from '@mdi/react'
import AdminPage from '@Components/admin/AdminPage'
import { SwitchLabel } from '@Components/admin/SwitchLabel'
import { showErrorNotification } from '@Utils/ApiErrorHandler'
import api, { AccountPolicy, ConfigEditModel, GlobalConfig } from '@Api'

const Configs: FC = () => {
  const { data: configs, mutate } = api.admin.useAdminGetConfigs({
    refreshInterval: 0,
    revalidateIfStale: false,
    revalidateOnFocus: false,
  })

  const [disabled, setDisabled] = useState(false)
  const [globalConfig, setGlobalConfig] = useState<GlobalConfig | null>()
  const [accountPolicy, setAccountPolicy] = useState<AccountPolicy | null>()

  useEffect(() => {
    if (configs) {
      setGlobalConfig(configs.globalConfig)
      setAccountPolicy(configs.accountPolicy)
    }
  }, [configs])

  const updateConfig = (conf: ConfigEditModel) => {
    setDisabled(true)
    api.admin
      .adminUpdateConfigs(conf)
      .then(() => {
        mutate({ ...conf })
      })
      .catch(showErrorNotification)
      .finally(() => {
        api.info.mutateInfoGetGlobalConfig()
        setDisabled(false)
      })
  }

  return (
    <AdminPage isLoading={!configs}>
      <Stack style={{ width: '100%' }}>
        <Group position="apart">
          <Title order={2}>平台设置</Title>
          <Button
            leftIcon={<Icon path={mdiContentSaveOutline} size={1} />}
            onClick={() => {
              updateConfig({ globalConfig })
            }}
          >
            保存配置
          </Button>
        </Group>
        <Divider />
        <Stack>
          <SimpleGrid cols={2}>
            <TextInput
              label="平台名称"
              description="平台名称将显示在网页标题、页面顶部等位置，后跟 ::CTF 字段"
              value={globalConfig?.title ?? ''}
              onChange={(e) => {
                setGlobalConfig({ ...(globalConfig ?? {}), title: e.currentTarget.value })
              }}
            />
          </SimpleGrid>
          <Group position="apart">
            <Title order={2}>账户策略</Title>
            <Button
              leftIcon={<Icon path={mdiContentSaveOutline} size={1} />}
              onClick={() => {
                updateConfig({ accountPolicy })
              }}
            >
              保存配置
            </Button>
          </Group>
          <Divider />
          <SimpleGrid cols={2}>
            <Switch
              checked={accountPolicy?.allowRegister ?? true}
              disabled={disabled}
              label={SwitchLabel('允许新用户注册', '是否允许用户注册新账户')}
              onChange={(e) =>
                setAccountPolicy({
                  ...(accountPolicy ?? {}),
                  allowRegister: e.currentTarget.checked,
                })
              }
            />
            <Switch
              checked={accountPolicy?.emailConfirmationRequired ?? false}
              disabled={disabled}
              label={SwitchLabel('需要邮箱确认', '用户注册、更换邮箱、找回密码是否需要邮件确认')}
              onChange={(e) =>
                setAccountPolicy({
                  ...(accountPolicy ?? {}),
                  emailConfirmationRequired: e.currentTarget.checked,
                })
              }
            />
            <Switch
              checked={accountPolicy?.activeOnRegister ?? true}
              disabled={disabled}
              label={SwitchLabel('注册后自动激活', '是否在新用户注册后自动激活账户')}
              onChange={(e) =>
                setAccountPolicy({
                  ...(accountPolicy ?? {}),
                  activeOnRegister: e.currentTarget.checked,
                })
              }
            />
            <Switch
              checked={accountPolicy?.useGoogleRecaptcha ?? false}
              disabled={disabled}
              label={SwitchLabel('使用谷歌验证码', '是否在用户发送验证邮件时检查谷歌验证码有效性')}
              onChange={(e) =>
                setAccountPolicy({
                  ...(accountPolicy ?? {}),
                  useGoogleRecaptcha: e.currentTarget.checked,
                })
              }
            />
          </SimpleGrid>
          <TextInput
            label="可用邮箱域名列表"
            description="允许注册的邮箱域名列表，多个域名用逗号分隔，留空则不限制"
            placeholder="不限制注册域名"
            value={accountPolicy?.emailDomainList ?? ''}
            onChange={(e) => {
              setAccountPolicy({ ...(accountPolicy ?? {}), emailDomainList: e.currentTarget.value })
            }}
          />
        </Stack>
      </Stack>
    </AdminPage>
  )
}

export default Configs
