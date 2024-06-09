import React from 'react';
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

const Blogs = () => {
  const navigation = useNavigation();
  const healthBlogs = [
    {
      stars: 5,
      title: 'Building Strong Bones: The Role of Nutrition and Exercise',
      blog: `Maintaining optimal bone health is vital for overall well-being, especially as we age. Bones provide structural support, protect organs, and store minerals. Let's explore the essential nutrients, exercises, and lifestyle habits that contribute to building and maintaining strong bones.
      
            Calcium and vitamin D are crucial for bone health. Incorporate dairy products, leafy greens, and fortified foods into your diet to ensure an adequate intake of these nutrients. Weight-bearing exercises, such as walking, running, and weightlifting, stimulate bone formation and density.
      
            Additionally, engage in activities that improve balance and coordination to reduce the risk of falls and fractures. A combination of proper nutrition and regular exercise supports bone health throughout different life stages.
          `,
      titleImage: require('../../assets/images/blog1.png'),
    },
    {
      stars: 5,
      title: 'Understanding the Gut Microbiome: Key to Digestive Health',
      blog: `The gut microbiome, consisting of trillions of microorganisms, plays a crucial role in digestion, nutrient absorption, and immune function. This complex ecosystem influences various aspects of our health. Let's delve into the factors that shape the gut microbiota and how a balanced microbiome contributes to digestive well-being.
      
            Diet greatly influences the composition of the gut microbiome. A diet rich in fiber promotes the growth of beneficial bacteria, supporting a diverse and healthy microbiota. Probiotics, found in fermented foods like yogurt and kefir, introduce beneficial bacteria to the gut.
      
            Maintaining a balanced gut microbiome is linked to improved digestion, reduced inflammation, and enhanced immune function. Learn about the dietary and lifestyle practices that foster a harmonious relationship with your gut microbiota.
          `,
      titleImage: require('../../assets/images/blog2.png'),
    },
    {
      stars: 4,
      title: 'The Importance of Adequate Hydration for Health',
      blog: `Proper hydration is essential for maintaining various bodily functions, including temperature regulation, nutrient transport, and waste elimination. Dehydration can lead to fatigue, dizziness, and impaired cognitive function. Let's explore the signs of dehydration, recommended fluid intake, and the benefits of staying adequately hydrated.
      
            The Institute of Medicine recommends about 3.7 liters (125 ounces) of total daily water intake for men and 2.7 liters (91 ounces) for women. This includes water obtained from beverages and food. Factors such as climate, physical activity, and individual health conditions may influence hydration needs.
      
            Adequate hydration supports optimal physical and mental performance. Discover practical tips for ensuring you meet your daily hydration requirements and maintaining overall health.
          `,
      titleImage: require('../../assets/images/blog3.png'),
    },
    {
      stars: 3,
      title: 'Stress Management Strategies for a Healthy Life',
      blog: `Chronic stress can negatively impact both physical and mental health. Developing effective stress management strategies is essential for maintaining overall well-being. Let's explore mindfulness techniques, relaxation exercises, and lifestyle adjustments that can help alleviate stress and promote a healthier life.
      
            Mindfulness meditation involves focusing on the present moment, reducing anxiety about the future and regrets about the past. Deep breathing exercises, such as diaphragmatic breathing, activate the body's relaxation response, leading to a calmer state.
      
            Additionally, incorporating physical activity, getting adequate sleep, and fostering positive social connections contribute to stress reduction. By adopting a holistic approach to stress management, individuals can enhance their resilience and better navigate life's challenges.
          `,
      titleImage: require('../../assets/images/blog4.png'),
    },
    {
      stars: 5,
      title: 'Quality Sleep: A Cornerstone of Well-being',
      blog: `Getting sufficient, high-quality sleep is crucial for overall health and functioning. Sleep plays a vital role in various physiological processes, including immune function, hormone regulation, and memory consolidation. Let's explore the science of sleep cycles, the importance of a consistent sleep schedule, and tips for creating a sleep-friendly environment.
      
            The National Sleep Foundation recommends adults aim for 7-9 hours of sleep per night. Establishing a consistent sleep routine, avoiding stimulants before bedtime, and creating a comfortable sleep environment contribute to better sleep quality.
      
            Adequate sleep supports cognitive function, emotional well-being, and physical recovery. Discover practical strategies for improving sleep hygiene and prioritizing quality rest for enhanced overall well-being.
          `,
      titleImage: require('../../assets/images/blog5.png'),
    },
  ];
  return (
    <>
      <Header title={'Blogs'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 20, paddingHorizontal: 10}}>
        {healthBlogs.map((blog, index) => (
          <Pressable onPress={() => navigation.navigate('BlogDetails', {blog})}>
            <BlogCard blog={blog} key={index} />
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
export default Blogs;
