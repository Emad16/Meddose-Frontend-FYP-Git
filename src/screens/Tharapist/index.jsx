import React, {useState, useEffect} from 'react';
import {Appbar} from 'react-native-paper';
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
import {useNavigation} from '@react-navigation/native';
import Header from '../../components/Header';
import Input from '../../components/Input';

const Tharapist = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const TharapistList = [
    {
      stars: 4,
      title: 'Rebalance Physical Therapy: Pelvic Pain Relief',
      blog: `I named our practice Rebalance because Imbalance is the root of any issue in the body. These imbalances are everything from the muscles, joints, fascia to what you eat, nutritional habits, the amount of exercise, sleep and mind body relaxation you get on a daily basis. Healing the body starts by rebalancing yourself on all these levels from head to toe and inside out. Our bodies should function like a beautifully symphony…every organ, muscle, joint cell in our body should work in harmony to create a masterpiece we call function and living. If there is imbalance in this system then our performance is compromised and pain sets in.`,
      titleImage: {
        uri: 'https://www.rebalancept.com/wp-content/uploads/2017/04/P1260852-2.jpg',
      },
      videos: [
        {
          video: 'llLgcmHVzzo',
          title:
            'Frozen Shoulder: Four Exercises to Improve Stiffness and Relieve Pain',
        },
        {
          video: 'Lu_bPW2gv-M',
          title:
            'Rib Pain Without a Fracture: Causes, Symptoms, and Treatment Options Explained',
        },
        {
          video: '2W60S9jHYkI',
          title: 'Are you REALLY strong in your core?',
        },
        {
          video: 'oGtBYfOyNDE',
          title:
            'Shoulder Instability: Loose Shoulder Joint Exercises to Stabilize',
        },
      ],
    },
    {
      stars: 3,
      title: 'Michelle Kenway',
      blog: `elvic Exercises provides Physiotherapy exercise videos, information and products that improve your health and pelvic floor fitness.

      Our goal is to help you exercise safely with pelvic prolapse, after prolapse surgery, hysterectomy or general pelvic floor weakness.
      
      Pelvic Exercises’ presenter Michelle Kenway is a health professional (Physiotherapist), internationally renowned author and exercise instructor for women.`,
      titleImage: {
        uri: 'https://www.pelvicexercises.com.au/wp-content/uploads/2021/01/pelvic-floor-safe-exercises-1.jpg',
      },
      videos: [
        {
          video: 'WUgpqgfNzzY',
          title:
            'Tailbone Pain Exercises for Coccyx Pain Relief and Muscle Spasm',
        },
        {
          video: 'bXJkZ5fGU7c',
          title: 'How to Cough and Clear Phlegm - Physiotherapy Guide',
        },
        {
          video: 'Zn2KGW7C1jQ',
          title:
            'Knee Pain Stretch for Front of Knee (Patellofemoral Syndrome Treatment)',
        },
      ],
    },
    {
      stars: 5,
      title: 'Physio trendz',
      blog: `Prioritize your understanding of concepts with our Physiotherapy courses. Join Physio Prem Shah and Team to understand and learn different subjects and topics of physiotherapy curriculum.`,
      titleImage: {
        uri: 'https://academy.physiotrendz.com/_next/image?url=https%3A%2F%2Fd502jbuhuh9wk.cloudfront.net%2ForgData%2F651831c4e4b05be61a8bfb9f%2Fcover_2024-01-16T13%3A48%3A14.378Z.png&w=1920&q=75',
      },
      videos: [
        {
          title:
            'Watch How To Self Analyze Posture At Home |Posture | Analysis |self care |Physiotrendz',
          video: 'Tb03Y9VEJeM',
        },
        {
          title:
            'How To Use Crutches For Stair Climbing |physiotherapy |crutch walking |physiotrendz',
          video: '0SNJJcpvDX0',
        },
      ],
    },
    {
      stars: 5,
      title: 'Dennis Grewal',
      blog: `SPECIALTIES: 
Internal Medicine
Cardiology
Cardiovascular Disease
Echocardiography`,
      titleImage: {
        uri: 'https://lluh.org/sites/lluh.org/files/styles/focal_point_portrait_300x400/public/Grewal_Dennis_1200x1600.jpg?itok=QKToOJRv',
      },
      videos: [
        {
          video: 'yt3CpkmFAfc',
          title: 'Physio Neck Exercises Stretch & Relieve Routine',
        },
        {
          video: 'vhqsTUd7fas',
          title: 'Exercises for Flat Feet - Physiotherapist Toronto',
        },
      ],
    },
  ];

  useEffect(() => {
    setFilteredDataSource(TharapistList);

    return () => {};
  }, []);

  const searchFilterFunction = text => {
    // Check if searched text is not blank
    if (text) {
      const newData = TharapistList.filter(function (item) {
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
      setFilteredDataSource(TharapistList);
      setSearch(text);
    }
  };
  return (
    <>
      <Header title={'All physicians'} />
      <View style={{marginHorizontal: 20}}>
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
        {filteredDataSource.map((tharapist, index) => (
          <Pressable
            onPress={() => navigation.navigate('eachtharapist', {tharapist})}>
            <BlogCard blog={tharapist} key={index} />
          </Pressable>
        ))}
      </ScrollView>
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
export default Tharapist;
