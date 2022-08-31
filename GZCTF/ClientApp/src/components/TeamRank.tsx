import { FC } from 'react'
import { useParams } from 'react-router-dom'
import {
  Avatar,
  Group,
  Card,
  Stack,
  Title,
  Text,
  PaperProps,
  createStyles,
  Progress,
  Skeleton,
  PasswordInput,
} from '@mantine/core'
import { useClipboard } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { mdiCheck, mdiKey } from '@mdi/js'
import { Icon } from '@mdi/react'
import api from '@Api'

const useStyle = createStyles((theme) => ({
  number: {
    fontFamily: theme.fontFamilyMonospace,
    fontWeight: 700,
  },
}))

const TeamRank: FC<PaperProps> = (props) => {
  const { id } = useParams()
  const numId = parseInt(id ?? '-1')

  const { data: myteam } = api.game.useGameMyTeam(numId)

  const { classes, theme } = useStyle()

  const clipboard = useClipboard()

  const solved = (myteam?.rank.solvedCount ?? 0) / (myteam?.rank.challenges?.length ?? 1)

  return (
    <Card shadow="sm" {...props}>
      <Stack spacing={8}>
        <Group>
          <Avatar color="cyan" size="md" radius="md" src={myteam?.rank.avatar}>
            {myteam?.rank.name?.at(0) ?? 'T'}
          </Avatar>
          <Skeleton width="8rem" visible={!myteam}>
            <Title order={4}>{myteam?.rank.name ?? 'Loading'}</Title>
          </Skeleton>
        </Group>
        <Group
          grow
          style={{
            textAlign: 'center',
          }}
        >
          <Stack spacing={2}>
            <Skeleton visible={!myteam}>
              <Text className={classes.number}>{myteam?.rank.rank ?? 'Loading'}</Text>
            </Skeleton>
            <Text size="sm">排名</Text>
          </Stack>
          <Stack spacing={2}>
            <Skeleton visible={!myteam}>
              <Text className={classes.number}>{myteam?.rank.score ?? 'Loading'}</Text>
            </Skeleton>
            <Text size="sm">得分</Text>
          </Stack>
          <Stack spacing={2}>
            <Skeleton visible={!myteam}>
              <Text className={classes.number}>{myteam?.rank.solvedCount ?? 'Loading'}</Text>
            </Skeleton>
            <Text size="sm">攻克数量</Text>
          </Stack>
        </Group>
        <Progress value={solved * 100} />
        <PasswordInput
          value={myteam?.teamToken}
          readOnly
          icon={<Icon path={mdiKey} size={1} />}
          variant="unstyled"
          onClick={() => {
            clipboard.copy(myteam?.teamToken)
            showNotification({
              color: 'teal',
              message: '队伍Token已复制到剪贴板',
              icon: <Icon path={mdiCheck} size={1} />,
              disallowClose: true,
            })
          }}
          styles={{
            innerInput: {
              fontFamily: theme.fontFamilyMonospace,
            },
          }}
        />
      </Stack>
    </Card>
  )
}

export default TeamRank
