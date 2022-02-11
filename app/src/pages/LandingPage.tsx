import React, { useState } from 'react';
import { ChoiceGroup, IChoiceGroupOption, Image, mergeStyles, PrimaryButton, Stack, Text, TextField } from '@fluentui/react';
import heroSVG from '../assets/hero.svg';
import { DisplayNameField } from '../components/DisplayNameField';
import { Login } from '@microsoft/mgt-react';
import { useIsSignedIn } from '../hooks/useIsSignedIn';
import { PeoplePicker } from '@microsoft/mgt-react';

const OWN_NAME_LABEL = 'Your display name';
const OWN_NAME_PLACEHOLDER = 'Enter display name for you to join';

const TEAMS_NAMES_LABEL = 'Enter teams user display names, separate with commas, same size as teams IDs';
const TEAMS_NAMES_PLACEHOLDER = 'Name1, Name2, ...';

enum LocalStorageKeys {
  DisplayName = 'DisplayName',
  TeamsUserMRIs = 'TeamsUserMRIs',
  TeamsMemberNames = 'TeamsMemberNames'
};

const chatDetailsEntryOptionsGroupLabel = 'Option to enter chat thread details';
const chatDetailsEntryOptions: IChoiceGroupOption[] = [
  { key: 'GraphSearch', text: 'Graph Search', disabled: true },
  { key: 'Manual', text: 'Manual Entry' }
];

export interface LandingPageProps {
  onStartChat(chatDetails: { displayName: string; teamsUserMRIs: string, teamsMemberNames: string }): void;
  disableButton?: boolean;
}

export const LandingPage = (props: LandingPageProps) => {
  const [displayName, setDisplayName] = useState<string | undefined>((window.localStorage && window.localStorage.getItem(LocalStorageKeys.DisplayName)) ?? undefined);
  const [teamsMemberNames, setThreadMemberNames] = useState<string | undefined>((window.localStorage && window.localStorage.getItem(LocalStorageKeys.TeamsMemberNames)) ?? undefined);
  const [teamsUserMRIs, setTeamsUserMRIs] = useState<string | undefined>((window.localStorage && window.localStorage.getItem(LocalStorageKeys.TeamsUserMRIs)) ?? undefined);
  const [chatEntryChosenOption, setChatEntryChosenOption] = useState<IChoiceGroupOption>(chatDetailsEntryOptions[1]);
  const buttonDisabled = props.disableButton || !(chatEntryChosenOption.key === 'Manual' && displayName && teamsUserMRIs && teamsMemberNames );

  return (
    <Stack
      horizontal
      wrap
      horizontalAlign="center"
      verticalAlign="center"
      verticalFill
    >
      <Stack.Item className={imgContainerStyle}>
        <Image alt="logo" src={heroSVG.toString()} />
      </Stack.Item>
      <Stack.Item>
        <Heading />
        <RadioGroupChoice optionChosen={setChatEntryChosenOption} />
        {chatEntryChosenOption.key === 'GraphSearch' && <GraphSearchEntry />}
        {chatEntryChosenOption.key === 'Manual' && <ManualEntryOptions
          defaultName={displayName}
          defaultTeamsUserMRI={teamsUserMRIs}
          defaultTeamsUserNames={teamsMemberNames}
          setDisplayName={setDisplayName}
          setTeamsUserMRIs={setTeamsUserMRIs}
          setThreadMemberNames={setThreadMemberNames}
        />}
        <StartChatButton
          disabled={buttonDisabled}
          onStartChatClick={() => {
            if (displayName && teamsUserMRIs && teamsMemberNames) {
              (window.localStorage && window.localStorage.setItem(LocalStorageKeys.DisplayName, displayName));
              (window.localStorage && window.localStorage.setItem(LocalStorageKeys.TeamsUserMRIs, teamsUserMRIs));
              (window.localStorage && window.localStorage.setItem(LocalStorageKeys.TeamsMemberNames, teamsMemberNames));
              props.onStartChat({ displayName, teamsUserMRIs, teamsMemberNames });
            }
          }}
        />
      </Stack.Item>
    </Stack>
  );
}

const Heading = (): JSX.Element => (
  <Stack>
    <Text role={'heading'} aria-level={1} className={headerStyle}>ACS Teams Adhoc Sample</Text>
  </Stack>
)

const RadioGroupChoice = (props: {optionChosen: (option: IChoiceGroupOption ) => void}): JSX.Element => (
  <Stack>
    <ChoiceGroup
      styles={chatOptionsGroupStyles}
      label={chatDetailsEntryOptionsGroupLabel}
      defaultSelectedKey="Manual"
      options={chatDetailsEntryOptions}
      required={true}
      onChange={(_, option) => option && props.optionChosen(option)}
    />
  </Stack>
);

const ManualEntryOptions = (props: {
  defaultName: string | undefined;
  defaultTeamsUserMRI: string | undefined;
  defaultTeamsUserNames: string | undefined;
  setDisplayName: (newDisplayName: string) => void;
  setTeamsUserMRIs: (newTeamsUserMRI: string) => void;
  setThreadMemberNames: (newThreadMemberNames: string) => void;
}) => (
  <Stack className={configContainerStyle} tokens={configContainerStackTokens}>
    <Stack.Item>
      <DisplayNameField defaultName={props.defaultName} setName={props.setDisplayName} textLabel={OWN_NAME_LABEL} placeHolder={OWN_NAME_PLACEHOLDER} />
    </Stack.Item>
    <Stack.Item>
      <DisplayNameField defaultName={props.defaultTeamsUserNames} setName={props.setThreadMemberNames} textLabel={TEAMS_NAMES_LABEL} placeHolder={TEAMS_NAMES_PLACEHOLDER} />
    </Stack.Item>
    <Stack.Item>
      <TextField
        inputClassName={inputBoxTextStyle}
        label="Enter Teams User IDs to join the chat, separate with commas"
        onChange={(_, newValue) => props.setTeamsUserMRIs(newValue ?? '')}
        required
        styles={textFieldStyleProps}
        placeholder="8:orgid:"
        defaultValue={props.defaultTeamsUserMRI}
      />
    </Stack.Item>
    <Stack.Item>
    </Stack.Item>
  </Stack>
);

const GraphSearchEntry = () => {
  const isSignedIn = useIsSignedIn();

  return (
    <>
      {!isSignedIn && <Login />}
      {isSignedIn && <PeoplePicker />}
    </>
  );
};

const StartChatButton = (props: {
  disabled: boolean;
  onStartChatClick: () => void;
}) => (
  <Stack>
    <PrimaryButton
      disabled={props.disabled}
      className={buttonStyle}
      text={'Start Chat'}
      onClick={props.onStartChatClick}
    />
  </Stack>
)

const headerStyle = mergeStyles({
  fontWeight: 600,
  fontSize: '1.25rem',
  lineHeight: '1.75rem',
  marginBottom: '1.5rem'
});

const imgContainerStyle = mergeStyles({
  width: '16.5rem',
  padding: '0.5rem',
  '@media (max-width: 67.1875rem)': {
    display: 'none'
  },

  marginRight: '4rem', //space between image and right-hand-side info
  marginLeft: '-6rem' //quick hack back into the center
});

const configContainerStackTokens = {
  childrenGap: '0.75rem'
};

const configContainerStyle = mergeStyles({
  minWidth: '10rem',
  width: 'auto',
  height: 'auto',
  marginTop: '1rem'
});

const textFieldStyleProps = {
  fieldGroup: {
    height: '2.3rem'
  }
};

const inputBoxTextStyle = mergeStyles({
  fontSize: '0.875rem',
  fontWeight: 600,
  lineHeight: '1.5rem',
  '::-webkit-input-placeholder': {
    fontSize: '0.875rem',
    fontWeight: 600
  },
  '::-moz-placeholder': {
    fontSize: '0.875rem',
    fontWeight: 600
  },
  ':-moz-placeholder': {
    fontSize: '0.875rem',
    fontWeight: 600
  }
});

const buttonStyle = mergeStyles({
  fontWeight: 600,
  fontSize: '0.875rem',
  width: '100%',
  height: '2.5rem',
  borderRadius: 3,
  padding: '0.625rem',
  marginTop: '1.5rem'
});

const chatOptionsGroupStyles = {
  label: { padding: 0 }
};
