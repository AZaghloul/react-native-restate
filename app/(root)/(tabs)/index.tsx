import { Card, FeaturedCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import { getLatestProperties, getProperties } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { useAppwrite } from "@/lib/useAppwrite";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import NoResults from "@/components/NoResults";

export default function Index() {
  const { user } = useGlobalContext();
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();
  const { loading: latestPropertiesLoading, data: latestProperties } =
    useAppwrite({
      fn: getLatestProperties,
    });

  const {
    loading: propertiesLoading,
    data: properties,
    refetch,
  } = useAppwrite({
    fn: getProperties,
    params: {
      filter: params.filter!,
      query: params.query!,
      limit: 6,
    },
    skip: true,
  });

  useEffect(() => {
    refetch({
      filter: params.filter!,
      query: params.query!,
      limit: 6,
    });
  }, [params.filter, params.query]);

  const handelCardPress = (id: string) => {
    router.push(`/properties/${id}`);
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={properties}
        renderItem={({ item }) => (
          <Card item={item} onPress={() => handelCardPress(item.$id)} />
        )}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          propertiesLoading ? (
            <ActivityIndicator className="text-primary-300 mt-5" size="large" />
          ) : (
            <NoResults />
          )
        }
        ListHeaderComponent={
          <View className="px-5">
            <TouchableOpacity
              onPress={() => router.push("/(root)/(tabs)/profile")}
            >
              <View className="flex flex-row items-center justify-between mt-5">
                {/* Hello section */}
                <View className="flex flex-row items-center">
                  <Image
                    source={{ uri: user?.avatar }}
                    className="size-12 rounded-full"
                  />
                  <View className="flex flex-col items-center justify-center ml-2">
                    <Text className="font-rubik text-xs text-black-100">
                      Good Morning!
                    </Text>
                    <Text className="text-base text-black-300 font-rubik-medium">
                      {user?.name}
                    </Text>
                  </View>
                </View>
                <Image source={icons.bell} className="size-6" />
              </View>
            </TouchableOpacity>

            <Search />

            {/* Featured */}
            <View className="my-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-bold text-black-300">
                  Featured
                </Text>
                <TouchableOpacity>
                  <Text
                    className="text-base font-rubik-bold text-primary-300"
                    onPress={() => router.push("/(root)/(tabs)/explore")}
                  >
                    See All
                  </Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={latestProperties}
                renderItem={({ item }) => (
                  <FeaturedCard
                    item={item}
                    onPress={() => handelCardPress(item.$id)}
                  />
                )}
                keyExtractor={(item) => item.$id}
                horizontal
                bounces={false}
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="flex gap-5 mt-5"
                ListEmptyComponent={
                  latestPropertiesLoading ? (
                    <ActivityIndicator
                      className="text-primary-300 mt-5"
                      size="large"
                    />
                  ) : (
                    <NoResults />
                  )
                }
              />
            </View>

            {/* Recommendations */}
            <View className="my-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-bold text-black-300">
                  Our Recommendations
                </Text>
                <TouchableOpacity>
                  <Text
                    className="text-base font-rubik-bold text-primary-300"
                    onPress={() => router.push("/(root)/(tabs)/explore")}
                  >
                    See All
                  </Text>
                </TouchableOpacity>
              </View>

              <Filters />
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}
