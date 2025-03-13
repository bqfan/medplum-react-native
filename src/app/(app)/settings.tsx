/* eslint-disable react/react-in-jsx-scope */
import { Env } from '@env';
import { useMedplum } from '@medplum/react-hooks';
import * as WebBrowser from 'expo-web-browser';
import { useColorScheme } from 'nativewind';

import { Item } from '@/components/settings/item';
import { ItemsContainer } from '@/components/settings/items-container';
import { LanguageItem } from '@/components/settings/language-item';
import { ThemeItem } from '@/components/settings/theme-item';
import { colors, FocusAwareStatusBar, ScrollView, View } from '@/components/ui';
import { Github, Rate, Share, Support, Website } from '@/components/ui/icons';
import { Text } from '@/components/ui/text';
import { translate } from '@/lib';

/* eslint-disable max-lines-per-function */
export default function Settings() {
  const medplum = useMedplum();

  //const signOut = useAuth.use.signOut();
  const { colorScheme } = useColorScheme();
  const iconColor =
    colorScheme === 'dark' ? colors.neutral[400] : colors.neutral[500];

  interface OpenWebsiteProps {
    url: string;
  }

  const openWebsite = async ({ url }: OpenWebsiteProps): Promise<void> => {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      console.error('Error opening browser:', error);
    }
  };

  function medplumSignOut(): void {
    medplum.signOut().catch(console.error);
  }

  return (
    <>
      <FocusAwareStatusBar />

      <ScrollView>
        <View className="flex-1 px-4 pt-16 ">
          <Text className="text-xl font-bold">
            {translate('settings.title')}
          </Text>
          <ItemsContainer title="settings.generale">
            <LanguageItem />
            <ThemeItem />
          </ItemsContainer>

          <ItemsContainer title="settings.about">
            <Item text="settings.app_name" value={Env.NAME} />
            <Item text="settings.version" value={Env.VERSION} />
          </ItemsContainer>

          <ItemsContainer title="settings.support_us">
            <Item
              text="settings.share"
              icon={<Share color={iconColor} />}
              onPress={() => {}}
            />
            <Item
              text="settings.rate"
              icon={<Rate color={iconColor} />}
              onPress={() => {}}
            />
            <Item
              text="settings.support"
              icon={<Support color={iconColor} />}
              onPress={() => {}}
            />
          </ItemsContainer>

          <ItemsContainer title="settings.links">
            <Item text="settings.privacy" onPress={() => {}} />
            <Item text="settings.terms" onPress={() => {}} />
            <Item
              text="settings.github"
              icon={<Github color={iconColor} />}
              onPress={() =>
                openWebsite({ url: 'https://github.com/bqfan/fhir-app' })
              }
            />
            <Item
              text="settings.website"
              icon={<Website color={iconColor} />}
              onPress={() => openWebsite({ url: 'https://hl7.org/fhir' })}
            />
          </ItemsContainer>

          <View className="my-8">
            <ItemsContainer>
              <Item
                text="settings.logout"
                onPress={() => {
                  medplumSignOut();
                }}
              />
            </ItemsContainer>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
