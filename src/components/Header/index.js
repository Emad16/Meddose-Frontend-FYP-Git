import {useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import {Appbar} from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import {fonts} from '../../utils/theme/fonts';
import {colors} from '../../utils/theme/colors';
import {SCREEN_WIDTH} from '../../utils/Methods';

const Header = ({title}) => {
  const navigation = useNavigation();
  const route = useRoute();
  return (
    // <Appbar.Header style={{...styles.header}}>
    //   <View
    //     style={{
    //       flexDirection: 'row',
    //       width: SCREEN_WIDTH - 40,
    //       alignItems: 'center',
    //       justifyContent: 'space-between',
    //     }}>
    //     <Text
    //       style={{
    //         color: colors.white,
    //         fontFamily: fonts.Montserrat_SemiBold,
    //         fontSize: 30,
    //         letterSpacing: -0.5,
    //         padding: 7,
    //       }}>
    //       {title}
    //     </Text>

    //     <View
    //       style={{
    //         marginLeft: 10,
    //         flexDirection: 'row',
    //         alignItems: 'center',
    //       }}>
    //       <View
    //         style={{
    //           borderRadius: 50,
    //           backgroundColor: colors.filterButton,
    //           padding: 10,
    //           margin: 0,
    //         }}>
    //         <TouchableOpacity
    //           onPress={() => {
    //             navigation.goBack();
    //           }}>
    //           {/* <FilterIcon /> */}
    //           <Entypo name="arrow-long-left" size={30} color={colors.white} />
    //         </TouchableOpacity>
    //       </View>
    //     </View>
    //   </View>
    // </Appbar.Header>
    <Appbar.Header style={{...styles.header}}>
      {/* <View
        style={{
          flexDirection: 'row',
          width: SCREEN_WIDTH - 40,
          alignItems: 'center',
          // justifyContent: 'space-between',
        }}> */}
      <Text
        style={{
          color: colors.white,
          fontFamily: fonts.Montserrat_SemiBold,
          fontSize: 30,
          letterSpacing: -0.5,
          padding: 7,
        }}>
        {title}
      </Text>

      {/* <View
        style={{
          marginLeft: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View
          style={{
            borderRadius: 50,
            backgroundColor: colors.filterButton,
            padding: 10,
            margin: 0,
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Entypo name="arrow-long-left" size={30} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View> */}
    </Appbar.Header>
  );
};
const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 90,
    borderRadius: 130 / 2,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    backgroundColor: colors.secondry,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
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
});

export default Header;
