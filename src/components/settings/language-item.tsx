import { getLocales } from 'expo-localization';
import * as React from 'react';
import { useColorScheme } from 'react-native';

import type { OptionType } from '@/components/ui';
import { colors, Options, useModal } from '@/components/ui';
import { Language as LanguageIcon } from '@/components/ui/icons';
import { useDefaultLanguage, useSelectedLanguage } from '@/lib';
import { translate } from '@/lib';
import { type Language, resources } from '@/lib/i18n/resources';

import { Item } from './item';

export const LanguageItem = () => {
  const languageCode = getLocales()[0].languageCode;
  const { language, setLanguage } = useSelectedLanguage();
  const { setDefaultLanguage } = useDefaultLanguage();

  const defalt_language =
    language === undefined
      ? languageCode && Object.keys(resources).includes(languageCode)
        ? languageCode
        : 'en'
      : language;

  React.useEffect(() => {
    if (language === undefined) {
      setDefaultLanguage(defalt_language as Language);
    }
  }, [defalt_language, language, setDefaultLanguage]);

  const modal = useModal();
  const onSelect = React.useCallback(
    (option: OptionType) => {
      setLanguage(option.value as Language);
      modal.dismiss();
    },
    [setLanguage, modal]
  );

  const langs = React.useMemo(
    () => [
      { label: translate('settings.english'), value: 'en' },
      { label: translate('settings.arabic'), value: 'ar' },
    ],
    []
  );

  const selectedLanguage = React.useMemo(
    () => langs.find((lang) => lang.value === language),
    [language, langs]
  );

  const colorScheme = useColorScheme();
  const iconColor =
    colorScheme === 'dark' ? colors.neutral[400] : colors.neutral[500];
  return (
    <>
      <Item
        text="settings.language"
        icon={<LanguageIcon color={iconColor} />}
        value={selectedLanguage?.label}
        onPress={modal.present}
      />
      <Options
        ref={modal.ref}
        options={langs}
        onSelect={onSelect}
        value={selectedLanguage?.value}
      />
    </>
  );
};
