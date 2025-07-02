import { Link } from 'expo-router';
import { View } from 'react-native';
import { styles } from '../../styles/tabs.styles';

export default function Index() {
  return (
    <View style={styles.container}>
      <Link href='/notifications'>Feed screen in tabs</Link>
    </View>
  );
}
