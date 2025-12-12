
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function childlogin() {
     return (
          <View className="flex-1 items-center justify-center bg-green-500">
               <Link href="/" className="absolute left-4 top-12">
                    <Text className="font-bold text-white">← Back</Text>
               </Link>
               <View
                    className={[
                         'h-3/5',
                         'w-4/5',
                         'items-start',
                         'rounded-xl',
                         'bg-white',
                         'p-8',
                         'drop-shadow-lg',
                    ].join(' ')}
               >
                    <View className="w-full">
                         <Text className="text-center text-xl text-green-500">Hello! Tap your name to continue your adventure.</Text>
                    </View>

                    <View className="mt-4 w-full h-2/5 border-2 border-green-500 rounded-xl items-center justify-center">
                        <text className="text-gray-950 text-lg font-bold">• Child User 1</text>
                    </View>

                    <Pressable
                         className={[
                              'mt-4',
                              'w-full',
                              'items-center',
                              'rounded-3xl',
                              'bg-yellow-400',
                         ].join(' ')}
                    >
                         <Text className={['p-4', 'font-bold', 'text-white'].join(' ')}>
                              Let's go!
                         </Text>
                    </Pressable>
               </View>
          </View>
     );
}
