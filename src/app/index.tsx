import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function Index() {
  return (
              <View className="flex-1 items-center justify-center bg-green-500">
               <View
                    className={[
                         'h-32',
                         'w-32',
                         'items-center',
                         'rounded-3xl',
                         'bg-white',
                         'p-4',
                         'drop-shadow-lg',
                    ].join(' ')}
               >
                    <Ionicons name="home" size={64} color="#D32F2F" />
               </View>
               <Text className={['m-4', 'text-center', 'text-4xl', 'text-white'].join(' ')}>
                    Welcome to the Farm!
               </Text>
               <Text className={['m-2', 'mb-10', 'text-center', 'text-md', 'text-white'].join(' ')}>
                    Choose how you'd like to explore.
               </Text>

               <Pressable
                    onPress={() => router.push('/login/ParentLogin')}
                    className={[
                         'mt-4',
                         'w-4/5',
                         'items-center',
                         'rounded-xl',
                         'bg-white',
                         'drop-shadow-lg',
                    ].join(' ')}
               >
                    <Text className={['p-4', 'font-bold', 'text-green-500'].join(' ')}>
                         Log In as Parent
                    </Text>
               </Pressable>
               <Pressable
                    onPress={() => router.push('/login/ChildLogin')}
                    className={[
                         'mt-4',
                         'w-4/5',
                         'items-center',
                         'rounded-xl',
                         'bg-yellow-400',
                         'drop-shadow-lg',
                    ].join(' ')}
               >
                    <Text className={['p-4', 'font-bold', 'text-white'].join(' ')}>
                         Log In as Child
                    </Text>
               </Pressable>
          </View>
  );
}
