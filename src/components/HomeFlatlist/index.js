import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import {
  Pressable,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
} from 'react-native';
import {
  useNavigation,
  useIsFocused,
  useFocusEffect,
} from '@react-navigation/native';
import Card from '../Card';
import {apiBaseURLV1} from '../../ApiBaseURL';
import {useSelector} from 'react-redux';
import {showLog} from '../../utils/Methods';
import axios from 'axios';
import _ from 'lodash';
import EmptyList from '../EmptyList';
import Loader from '../PageLoader/Loader';
import {fonts} from '../../utils/theme/fonts';
import {colors} from '../../utils/theme/colors';

const HomeFlatlist = forwardRef(({setLoader, searchText, loader}, ref) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const {user} = useSelector(state => state.auth);
  const {Cities, filterParam, appliedFilters} = useSelector(
    state => state.lisitng,
  );
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [footerLoader, setFooterLoader] = useState(false);

  const [signal, setSignal] = useState('');
  const flatlistRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      getAdList: () => {
        setLoader(true);

        getList();
      },
    }),
    [],
  );

  const getList = async () => {
    showLog(data, 'data in array');
    showLog(page, 'page in get list');
    if (page == 1) {
      console.log('here in the list');
      data.length = 0;
    }
    try {
      const response = await axios.get(
        `${apiBaseURLV1}/get/listings/${page}?id=${user.id}`,
        {
          signal,
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );
      setTotalPage(response?.data?.total_pages);
      setData([...data, ...response?.data?.data]);
      setLoader(false);
      setRefreshing(false);
      setFooterLoader(false);
      if (response.data.data.length == 0) {
        setIsEmpty(true);
      }
    } catch (error) {
      setLoader(false);
      setRefreshing(false);
      setFooterLoader(false);
      showLog('error', error);
    }
  };

  useEffect(() => {
    // because of page number
    if (data.length > 0) {
      console.log('setFooterLoader(true);');
      setFooterLoader(true);
    }
    getList();
  }, [page]);

  useEffect(() => {
    // data.length = 0;
    setLoader(true);

    setPage(1);
  }, []);

  return (
    <>
      {isEmpty ? (
        <EmptyList />
      ) : (
        <FlatList
          ref={flatlistRef}
          initialNumToRender={5}
          contentContainerStyle={styles.scrollviewstyles}
          data={data}
          onEndReached={() => {
            console.log(totalPage, 'totalPage');
            console.log(page, 'Page');
            // if (totalPage != page) {
            //   console.log(page + 1, 'adding 1 in Page number');
            //   setPage(page + 1);
            // }
            if (totalPage != page) {
              console.log(page + 1, 'adding 1 in Page number');
              if (data.length != 0) setPage(page + 1);
            }
          }}
          renderItem={({item, index}) => {
            return (
              <Pressable
                onPress={() =>
                  navigation.navigate('DetailPage', {
                    id: item?.id,
                    author: item?.author,
                  })
                }>
                <Card key={index} data={item} index={index} orignal={data} />
              </Pressable>
            );
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                if (page == 1) {
                  getList();
                } else {
                  setPage(1);
                }
              }}
            />
          }
          ListFooterComponentStyle={{
            flex: 1,
            justifyContent: 'flex-end',
            // marginTop: -50,
            paddingBottom: 60,
            alignItems: 'center',
          }}
          ListFooterComponent={() => {
            if (footerLoader && !loader && !refreshing) {
              return <Text style={styles.pageLoader}>Loading...</Text>;
            } else {
              return null;
            }
          }}
        />
      )}
    </>
  );
});

const styles = StyleSheet.create({
  scrollviewstyles: {
    justifyContent: 'flex-start',
    margin: 20,
    flexGrow: 1,
  },
  pageLoader: {
    color: colors.text,
    fontWeight: '600',
    fontFamily: fonts.Montserrat_SemiBold,
    letterSpacing: -0.5,
    fontSize: 15,
    marginTop: 5,
  },
});
export default HomeFlatlist;
