import React, {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Pressable,
  RefreshControl,
} from 'react-native';
import EmptyList from '../EmptyList';
import Loader from '../PageLoader/Loader';
import Card from '../Card';
import {fonts} from '../../utils/theme/fonts';
import axios from 'axios';
import {apiBaseURLV1} from '../../ApiBaseURL';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {showLog} from '../../utils/Methods';
import {colors} from '../../utils/theme/colors';

const ActiveFLatlist = forwardRef(({filter}, ref) => {
  const [isEmpty, setIsEmpty] = useState(false);
  const [data, setData] = useState([]);
  const [totalPage, setTotalPage] = useState('');
  const [page, setPage] = useState(1);
  const [loader, setLoader] = useState(false);
  const navigation = useNavigation();
  const footerRef = useRef();
  const {user} = useSelector(State => State.auth);
  const [refreshing, setRefreshing] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      getActiveListing: () => {
        getData();
      },
    }),
    [],
  );

  const getData = () => {
    setData([]);
    setTimeout(() => {
      if (page == 1) {
        getList();
      } else {
        setPage(1);
      }
    }, 1000);
  };
  useEffect(() => {
    getList();
    return () => {};
  }, [page]);

  const getList = async () => {
    try {
      showLog(page, 'Page number in getActiveList');
      setLoader(true);
      const response = await axios.get(
        `${apiBaseURLV1}/get/listings/${page}?own=1&status=publish`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );
      // console.log('response of my list',response.data.data);
      setData([...data, ...response?.data?.data]);
      if (response.data.data.length == 0) {
        setIsEmpty(true);
      } else {
        setTotalPage(response?.data?.total_pages);
      }
      // setPendingData('');
      // setRemovedData('');
      // setPendingPage(1);
      // setRemovedPage(1);
      setLoader(false);
      setRefreshing(false);
    } catch (error) {
      setLoader(false);
      setRefreshing(false);
      setIsEmpty(true);
      console.log(error, 'error');
    }
  };

  return (
    <View style={styles.sectionContainer}>
      {isEmpty ? (
        <EmptyList />
      ) : (
        <FlatList
          ref={footerRef}
          initialNumToRender={5}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollviewstyles}
          data={data}
          ListFooterComponentStyle={{
            flex: 1,
            justifyContent: 'flex-end',
            paddingBottom: totalPage == page && !loader ? 20 : 60,
            alignItems: 'center',
          }}
          // ListFooterComponent={!loader ? <Loader /> : ''}
          ListFooterComponent={() => {
            if (loader) {
              return <Loader />;
            } else {
              return null;
            }
          }}
          // onEndReachedThreshold={0}
          onEndReached={() => {
            if (totalPage != page) {
              if (data.length != 0) {
                console.log(page + 1, 'adding 1 in Page number');
                setPage(page + 1);
              }
            }
          }}
          renderItem={({item, index}) => {
            return (
              <Pressable
                onPress={() =>
                  navigation.navigate('DetailPage', {
                    comingFrom: filter,
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
                data.length = 0;
                setTimeout(() => {
                  if (page == 1) {
                    console.log('PAGE IS 1 ON REFREASH');
                    getList();
                  } else {
                    console.log('SET PAGE IS 1 ON REFREASH');
                    setPage(1);
                  }
                }, 1000);
              }}
            />
          }
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  scrollviewstyles: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    margin: 5,
  },
  sectionContainer: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
  },
  buttonSection: {},
  buttonStyle: {
    height: 45,
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 100,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 3,
    marginRight: 3,
    borderColor: colors.transparent,
  },

  font: {
    fontFamily: fonts.Montserrat_Medium,
    fontSize: 15,
  },
});
export default ActiveFLatlist;
