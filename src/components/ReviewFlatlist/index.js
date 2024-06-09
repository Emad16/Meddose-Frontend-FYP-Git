import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import EmptyList from '../EmptyList';
import Loader from '../PageLoader/Loader';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {apiBaseURLV1} from '../../ApiBaseURL';
import axios from 'axios';
import ReviewCard from '../BlogCard';
import {fonts} from '../../utils/theme/fonts';
import {SCREEN_WIDTH, showLog, updatedDate} from '../../utils/Methods';
import {Modal, Portal} from 'react-native-paper';
import {StarRatingDisplay} from 'react-native-star-rating-widget';
import {colors} from '../../utils/theme/colors';

const ReviewFlatlist = ({authorId}, ref) => {
  const [isEmpty, setIsEmpty] = useState(true);
  const [data, setData] = useState([]);
  const [totalPage, setTotalPage] = useState('');
  const [review, setReview] = useState('');
  const [page, setPage] = useState(1);
  const [loader, setLoader] = useState(false);
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const reviewRef = useRef();

  const {user} = useSelector(State => State.auth);

  useFocusEffect(
    useCallback(() => {
      showLog('being hit');
      getData();
      return () => {
        setPage(1);
        setTotalPage('');
      };
    }, []),
  );
  const getData = () => {
    setData([]);
    setIsEmpty(true);
    setTimeout(() => {
      if (page == 1) {
        getReviewList();
      } else {
        showLog('page is being set');
        setPage(1);
      }
    }, 1000);
  };

  useEffect(() => {
    if (page != 1) {
      getReviewList();
    }
  }, [page]);

  const getReviewList = async () => {
    showLog(
      `${apiBaseURLV1}/get/listings/${authorId}/${page ? page : 1}?ab`,
      'URL query',
    );
    try {
      setLoader(true);
      const response = await axios.get(
        `${apiBaseURLV1}/get/reviews/${authorId}/${page}?ab`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );
      setTotalPage(response?.data?.total_pages);
      setData([...data, ...response?.data?.data]);
      showLog('api result of page number', response.data.current_page);
      setLoader(false);
      if (response.data.data.length == 0) {
        setIsEmpty(true);
      } else {
        setIsEmpty(false);
      }
    } catch (error) {
      setLoader(false);
      setIsEmpty(false);
      showLog('error', error);
    }
  };
  const showModal = data => {
    setVisible(true);
    showLog(data, 'review in review');
    setReview(data);
  };
  const hideModal = () => setVisible(false);
  return (
    <>
      {isEmpty ? (
        <View style={{paddingVertical: 40}}>
          <Loader />
        </View>
      ) : (
        <FlatList
          ref={reviewRef}
          horizontal={true}
          initialNumToRender={5}
          contentContainerStyle={styles.scrollviewstyles}
          data={data}
          onEndReached={() => {
            if (totalPage != page) {
              console.log(totalPage, 'totalPage');
              console.log(page, 'reviewpage');
              console.log(page + 1, 'adding 1 in filter Page number');
              if (data.length != 0) setPage(page + 1);
            }
          }}
          renderItem={({item, index, orignal}) => {
            return (
              <Pressable onPress={() => showModal(item)}>
                <ReviewCard review={item} key={index} />
              </Pressable>
            );
          }}
          ListFooterComponentStyle={{
            flex: 1,
            justifyContent: 'flex-start',
            paddingRight: totalPage == page && !loader ? 20 : 60,
            alignItems: 'center',
          }}
          ListFooterComponent={() => {
            if (loader) {
              return <Loader />;
            } else {
              return null;
            }
          }}
        />
      )}

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={{
            ...styles.modalStyles,
            maxHeight: Platform.OS == 'ios' ? null : '90%',
          }}>
          <Text style={[styles.Review_name, styles.font]}>
            {review?.author_name}
          </Text>
          <Text
            style={{...styles.review_date, marginBottom: 10, ...styles.font}}>
            Posted on {updatedDate(review?.post_date)}
          </Text>
          <StarRatingDisplay
            starSize={25}
            color={colors.activeReviewStar}
            style={{marginTop: 10, marginBottom: 20, marginLeft: 0}}
            starStyle={{marginLeft: -3}}
            rating={review?.stars}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={[styles.review_text, styles.font]}>
              {review?.comment}
            </Text>
          </ScrollView>
        </Modal>
      </Portal>
    </>
  );
};
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
  },
  modalStyles: {
    alignSelf: 'center',
    backgroundColor: colors.white,
    width: SCREEN_WIDTH - 50,
    borderRadius: 15,
    padding: 25,
  },
  Review_name: {
    fontSize: 20,
    color: colors.text,
    marginBottom: 10,
  },
  review_date: {
    fontSize: 12,
    color: colors.text,
  },
  review_text: {
    fontSize: 15,
    color: colors.text,
  },
});
export default ReviewFlatlist;
