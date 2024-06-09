import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from 'react';
import {
  Pressable,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
} from 'react-native';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import Card from '../Card';
import {apiBaseURLV1} from '../../ApiBaseURL';
import {useSelector} from 'react-redux';
import {showLog} from '../../utils/Methods';
import axios from 'axios';
import _ from 'lodash';
import EmptyList from '../EmptyList';
import {fonts} from '../../utils/theme/fonts';
import {colors} from '../../utils/theme/colors';

const FilterFlatlist = forwardRef(
  ({setLoader, setSearchText, setCity, loader}, ref) => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const {user} = useSelector(state => state.auth);
    const {Cities, filterParam, appliedFilters} = useSelector(
      state => state.lisitng,
    );
    const [totalPage, setTotalPage] = useState(1);
    const [filterPage, setFilterPage] = useState(1);
    const [filterData, setFilterData] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [footerLoader, setFooterLoader] = useState(false);

    const flatlistRef = useRef();
    useImperativeHandle(
      ref,
      () => ({
        setFilterPageNumber: number => {
          setFilterPage(number);
        },
      }),
      [],
    );

    const getFilteredListing = async () => {
      // setData('');
      // setSearchData('');
      // setPage(1);
      // setSearchPage(1);
      showLog('test in filters');
      setSearchText('');
      setCity('All Cities');
      // var filter = filterParam
      //   ? filterParam.join().replaceAll(',', '')
      //   : `?city=${city}`;
      var filter = filterParam.join().replaceAll(',', '');
      showLog(filter, 'filter in api');
      showLog(filterPage, 'filterpage in api');
      showLog(
        `${apiBaseURLV1}/get/listings/${filterPage ? filterPage : 1}${filter}`,
        'URL query',
      );
      try {
        const response = await axios.get(
          `${apiBaseURLV1}/get/listings/${
            filterPage ? filterPage : 1
          }${filter}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        );
        setTotalPage(response?.data?.total_pages);
        setFilterData([...filterData, ...response?.data?.data]);
        showLog('api result of page number', response.data.current_page);
        setLoader(false);
        setRefreshing(false);
        setFooterLoader(false);
        // setData('');
        // setSearchData('');
        if (response.data.data.length == 0) {
          setIsEmpty(true);
        } else {
          setIsEmpty(false);
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
      if (filterData.length > 0) {
        console.log('setFooterLoader(true);');
        setFooterLoader(true);
      }
      getFilteredListing();
    }, [filterPage]);

    useEffect(() => {
      // because of filter param
      filterData.length = 0;
      if (filterPage == 1) {
        setLoader(true);
        getFilteredListing();
      } else {
        setFilterPage(1);
      }
      // getFilteredListing();
    }, [filterParam, appliedFilters]);
    // }, [hasFilter, filterPage, city]);
    return (
      <>
        {isEmpty ? (
          <EmptyList />
        ) : (
          <FlatList
            ref={flatlistRef}
            initialNumToRender={5}
            contentContainerStyle={styles.scrollviewstyles}
            data={filterData}
            onEndReached={() => {
              console.log(totalPage, 'totalPage');
              console.log(filterPage, 'filterPage');
              if (totalPage != filterPage) {
                console.log(filterPage + 1, 'adding 1 in filter Page number');
                if (filterData.length != 0) setFilterPage(filterPage + 1);
              }
            }}
            renderItem={({item, index, orignal}) => {
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
                    orignal={filterData}
                  />
                </Pressable>
              );
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  filterData.length = 0;
                  setRefreshing(true);

                  if (filterPage == 1) {
                    getFilteredListing();
                  } else {
                    setFilterPage(1);
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
    color: colors.text,
    fontWeight: '600',
    fontFamily: fonts.Montserrat_SemiBold,
    letterSpacing: -0.5,
    fontSize: 15,
    marginTop: 5,
  },
});
export default FilterFlatlist;
