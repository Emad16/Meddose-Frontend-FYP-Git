import React from 'react';
import {Text, View} from 'react-native';
import {fonts} from '../../utils/theme/fonts';
import {colors} from '../../utils/theme/colors';
import {updatedDateNewFormat} from '../../utils/Methods';

const MoodCard = ({currentMood}) => {
  const getColorBasedOnBackground = backgroundColor => {
    // Calculate luminance
    const r = parseInt(backgroundColor.slice(1, 3), 16);
    const g = parseInt(backgroundColor.slice(3, 5), 16);
    const b = parseInt(backgroundColor.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Determine text color based on luminance
    return luminance > 0.5 ? 'black' : 'white';
  };

  return (
    <View
      style={{
        padding: 15,
        paddingHorizontal: 20,
        borderRadius: 30,
        justifyContent: 'space-between',
        // alignItems: 'center',
        borderColor: colors.border,
        borderWidth: 1,
        marginVertical: 10,
        gap: 10,
        backgroundColor: currentMood.mood.color,
      }}>
      <Text
        style={{
          fontSize: 20,
          fontFamily: fonts.Montserrat_SemiBold,
          color: getColorBasedOnBackground(currentMood.mood.color),
        }}>
        {currentMood.mood.mood}
      </Text>
      <Text
        style={{
          fontSize: 20,
          fontFamily: fonts.Montserrat_Medium,
          color: getColorBasedOnBackground(currentMood.mood.color),
          marginBottom: 10,
        }}>
        {updatedDateNewFormat(currentMood.createdAt)}
      </Text>
      {currentMood?.notes && (
        <View>
          <Text
            style={{
              fontSize: 20,
              fontFamily: fonts.Montserrat_SemiBold,
              color: getColorBasedOnBackground(currentMood.mood.color),
            }}>
            Notes
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontFamily: fonts.Montserrat_Medium,
              color: getColorBasedOnBackground(currentMood.mood.color),
              marginBottom: 10,
            }}>
            {currentMood.notes}
          </Text>
        </View>
      )}
    </View>
  );
};
export default MoodCard;
