import { images, offers } from '@/constants'
import cn from 'clsx'
import { Fragment } from 'react'
import {
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
const Index = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={offers}
        renderItem={({ item, index }) => {
          const isEven = index % 2 === 0

          return (
            <View>
              <Pressable
                className={cn(
                  'offer-card',
                  isEven ? 'flex-row-reverse' : 'flex-row'
                )}
                style={{ backgroundColor: item.color }}
                android_ripple={{ color: '#fffff22' }}
              >
                {({ pressed }) => (
                  <Fragment>
                    <View className="h-full w-1/2">
                      <Image
                        source={item.image}
                        className="size-full"
                        resizeMode="contain"
                      />
                    </View>
                    <View
                      className={cn(
                        'offer-card__info',
                        isEven ? 'pl-10' : 'pr-10'
                      )}
                    >
                      <Text className="h1-bold text-white leading-tight">
                        {item.title}
                      </Text>
                      <Image
                        className="h-10"
                        resizeMode="contain"
                        tintColor="#ffffff"
                        source={images.arrowRight}
                      />
                    </View>
                  </Fragment>
                )}
              </Pressable>
            </View>
          )
        }}
        ListHeaderComponent={() => (
          <View className="flex-between flex-row my-5 w-full">
            <View className="flex-start">
              <Text className="upper-case small-bold text-primary">
                DELIVER TO
              </Text>
              <TouchableOpacity className="flex-center flex-row gap-x-2 mt-0.5">
                <Text className="paragraph-bold text-dark-100">India</Text>
                <Image
                  source={images.arrowDown}
                  className="size-3"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerClassName="pb-28 px-5"
      />
    </SafeAreaView>
  )
}

export default Index
