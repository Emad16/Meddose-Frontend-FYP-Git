import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useEffect,
} from 'react';
import {
  Pressable,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Card from '../Card';
import {apiBaseURLV1} from '../../ApiBaseURL';
import {useSelector} from 'react-redux';
import {showLog} from '../../utils/Methods';
import axios from 'axios';
import _ from 'lodash';
import EmptyList from '../EmptyList';
import {fonts} from '../../utils/theme/fonts';

const SearchFlatlist = forwardRef(
  ({setLoader, searchText, city, loader}, ref) => {
    const navigation = useNavigation();
    const {user} = useSelector(state => state.auth);
    const [searchTotal, setSearchTotal] = useState(1);
    const [searchPage, setSearchPage] = useState(1);
    const [searchData, setSearchData] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [footerLoader, setFooterLoader] = useState(false);
    useImperativeHandle(
      ref,
      () => ({
        hitSearchList: txt => {
          setLoader(true);
          setIsEmpty(false);
          // searchData.length = 0;
          delayedQuery(txt);
        },
        // hitSearchListAfterCleanUp: (txt, city) => {
        //   setLoader(true);
        //   setIsEmpty(false);
        //   searchData.length = 0;
        //   setSearchPage(1);
        //   setTimeout(() => {
        //     console.log(txt, city, 'hitSearchListAfterCleanUp');
        //     getSearchList(txt, city);
        //   }, 1000);
        // },
      }),
      [],
    );
    const getSearchList = async (text, givenCity) => {
      // setData('');
      // setPage(1);
      // setSnackbarVal(false);
      // if (text == '') {
      //   return getList();
      // } else {

      try {
        const response = await axios.get(
          `${apiBaseURLV1}/get/listings/${searchPage}?search=${text}${
            // city != 'All Cities'
            //   ? givenCity
            //     ? `&city=${givenCity}`
            //     : `&city=${city}`
            //   : ''
            city != 'All Cities' ? `&city=${city}` : ''
          }`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        );
        showLog(
          `${apiBaseURLV1}/get/listings/${searchPage}?search=${text}${
            city ? `&city=${city}` : ''
          }`,
          'getSearchList with text',
        );

        setSearchTotal(response?.data?.total_pages);
        setSearchData([...searchData, ...response?.data?.data]);
        // showLog('this is search data', response.data.data);
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
        // showLog('error', error);
      }
      // }
    };

    const delayedQuery = useCallback(
      _.debounce(query => getSearchList(query), 1000),
      [searchPage],
    );
    useEffect(() => {
      if (searchText && searchText != '') {
        if (searchData.length > 0) {
          console.log('setFooterLoader(true);');
          setFooterLoader(true);
        } else {
          setLoader(true);
        }
        setIsEmpty(false);
        // searchData.length = 0;
        delayedQuery(searchText);
      }
      // else {
      //   getList();
      // }
    }, [searchPage]);

    return (
      <>
        {isEmpty ? (
          <EmptyList />
        ) : (
          <FlatList
            initialNumToRender={5}
            contentContainerStyle={styles.scrollviewstyles}
            data={searchData}
            onEndReached={() => {
              // searchTotal && searchTotal === searchPage
              //   ? ''
              //   : setSearchPage(searchPage + 1);

              if (searchTotal != searchPage) {
                console.log(searchPage + 1, 'adding 1 in filter Page number');
                if (searchData.length != 0) setSearchPage(searchPage + 1);
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
                  <Card
                    key={index}
                    data={item}
                    index={index}
                    orignal={searchData}
                  />
                </Pressable>
              );
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  searchData.length = 0;
                  if (searchPage == 1) {
                    getSearchList(searchText);
                  } else {
                    setSearchPage(1);
                  }
                }}
              />
            }
            ListFooterComponentStyle={{
              flex: 1,
              justifyContent: 'flex-end',
              // marginTop: -50,
              paddingBottom: 55,
              alignItems: 'center',
              // backgroundColor: 'red',
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
  },
);

const styles = StyleSheet.create({
  scrollviewstyles: {
    justifyContent: 'flex-start',
    margin: 20,
    flexGrow: 1,
  },
  pageLoader: {
    color: '#2A3D49',
    fontWeight: '600',
    fontFamily: fonts.Montserrat_SemiBold,
    letterSpacing: -0.5,
    fontSize: 15,
    marginTop: 5,
  },
});
export default SearchFlatlist;
