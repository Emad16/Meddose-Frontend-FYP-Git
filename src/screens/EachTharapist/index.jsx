import React, {useState, useEffect, useCallback} from 'react';
import {Appbar, Button} from 'react-native-paper';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import BlogCard from '../../components/BlogCard';
import {SCREEN_WIDTH} from '../../utils/Methods';
import {fonts} from '../../utils/theme/fonts';
import {colors} from '../../utils/theme/colors';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation, useRoute} from '@react-navigation/native';
import Header from '../../components/Header';
import Input from '../../components/Input';
import {WebView} from 'react-native-webview';

const EachTharapist = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {tharapist} = route.params;
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  // const TharapistVideoList = tharapist.videos;

  useEffect(() => {
    // fetchData();
    console.log('object', tharapist);
    setFilteredDataSource([...tharapist.videos]);

    return () => {};
  }, [tharapist]);

  const searchFilterFunction = text => {
    // Check if searched text is not blank
    if (text) {
      const newData = tharapist.videos.filter(function (item) {
        const itemData = item.title
          ? item.title.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(tharapist.videos);
      setSearch(text);
    }
  };

  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback(state => {
    if (state === 'ended') {
      setPlaying(false);
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying(prev => !prev);
  }, []);

  const fetchData = () => {
    // setLoading(true)
    fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=Inner+Dynamics+Physical+Therapy+Pelvic+Strengthening+1&type=video&key=AIzaSyAmTE2BuuPgW45xfh3tz6oxR0WoR1O7Re8`,
    )
      .then(res => res.json())
      .then(data => {
        console.log(data.items);
        // setLoading(false)
        // dispatch({type:"add",payload:data.items})
        //setMiniCard(data.items)
      })
      .catch(err => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (filteredDataSource)
      console.log(filteredDataSource, 'filteredDataSource');

    return () => {};
  }, [filteredDataSource]);

  return (
    <>
      <Header title={tharapist?.title} />
      <View style={{marginHorizontal: 20}}>
        <Input
          holder={'Search for session'}
          handleTextChange={searchFilterFunction}
          type="text"
          value={search}
        />
      </View>
      <ScrollView
        contentContainerStyle={{gap: 10, marginTop: 20, paddingBottom: 50}}>
        {filteredDataSource &&
          filteredDataSource?.map((video, index) => (
            <View
              style={{
                // width: '%',
                // height: 300,
                padding: 20,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: 'grey',
                marginHorizontal: 10,
                // marginVertical: 20,
              }}>
              <Text style={{fontSize: 14, fontWeight: 'bold', color: '#000'}}>
                Session no {index + 1}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#000',
                  marginTop: 10,
                  marginBottom: 5,
                }}>
                {video.title}
              </Text>
              <WebView
                source={{uri: `https://www.youtube.com/embed/${video.video}`}}
                style={{flex: 1, marginTop: 10, height: 200}}
              />
            </View>
          ))}
      </ScrollView>
      {/* <View style={{marginHorizontal: 20}}>
        <Input
          holder={'Search for physicist'}
          handleTextChange={searchFilterFunction}
          type="text"
          value={search}
        />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 20, paddingHorizontal: 10}}>
        {filteredDataSource.map((blog, index) => (
          <Pressable onPress={() => navigation.navigate('BlogDetails', {blog})}>
            <BlogCard blog={blog} key={index} />
          </Pressable>
        ))}
      </ScrollView> */}
    </>
  );
};

const styles = StyleSheet.create({
  scrollviewstyles: {
    justifyContent: 'flex-start',
    margin: 20,
    lexGrow: 1,
  },
  sectionContainer: {
    flex: 1,
    backgroundColor: colors.white,
    paddingBottom: 20,
  },
  buttonSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  buttonStyle: {
    height: 45,
    width: 100,
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
    fontSize: 16,
  },
  //header

  header: {
    backgroundColor: colors.secondry,
    height: 100,
    justifyContent: 'center',
    zIndex: 1001,
  },
  content: {
    marginLeft: 0,
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: -1,
  },
  title: {
    alignSelf: 'center',
    color: colors.white,
    fontFamily: fonts.Montserrat_Medium,
  },
  modalStyles: {
    height: '100%',
    color: colors.black,
  },
  containerStyle: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 20,
    margin: 20,
    color: colors.black,
  },
});
export default EachTharapist;
