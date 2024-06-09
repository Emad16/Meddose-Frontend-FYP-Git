import React from 'react';
import {useEffect, useState} from 'react';
import SelectDropdown from 'react-native-select-dropdown';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {StyleSheet} from 'react-native';
import {SCREEN_WIDTH, showLog} from '../../utils/Methods';
import {fonts} from '../../utils/theme/fonts';
import {colors} from '../../utils/theme/colors';
const Selector = ({
  holder,
  data,
  handleValueChange,
  value,
  comingFrom,
  dropHeight,
  dropDownStyle,
}) => {
  const [selectorData, setSelectorData] = useState(null);
  const [val, setval] = useState(null);
  useEffect(() => {
    setSelectorData(data);
    setval(value);
  }, [data]);
  useEffect(() => {
    setval(value);
    showLog(value, 'value in selector');
  }, [value]);
  return (
    <SelectDropdown
      data={selectorData}
      initialNumToRender={4}
      disabled={data && data.length > 0 ? false : true}
      onSelect={(selectedItem, index) => {
        handleValueChange(selectedItem);
        setval(selectedItem);
      }}
      defaultButtonText={value ? value?.name : holder}
      buttonTextAfterSelection={(selectedItem, index) => {
        return val ? val?.name : holder;
      }}
      rowTextForSelection={(item, index) => {
        return data ? item.name : item.title;
      }}
      buttonStyle={
        data && data.length > 0
          ? {
              ...styles.dropdown1BtnStyle,
              ...styles.backgroundDisabled,
              ...dropDownStyle,
              height: comingFrom ? 60 : 50,
            }
          : {...styles.dropdown1BtnStyle, height: comingFrom ? 65 : 50}
      }
      buttonTextStyle={
        val
          ? {...styles.dropdown1BtnTxtStyle, color: colors.text}
          : {...styles.dropdown1BtnTxtStyle, color: colors.placeholder}
      }
      renderDropdownIcon={isOpened => {
        return (
          <EvilIcons
            name={isOpened ? 'chevron-up' : 'chevron-down'}
            color={colors.secondry}
            size={36}
          />
        );
      }}
      dropdownIconPosition={'right'}
      dropdownStyle={{
        ...styles.dropdown1DropdownStyle,
        // height: dropHeight ? dropHeight : comingFrom ? null : 250,
      }}
      rowStyle={styles.dropdown1RowStyle}
      rowTextStyle={styles.dropdown1RowTxtStyle}
    />
  );
};
const styles = StyleSheet.create({
  dropdownsRow: {flexDirection: 'row', width: '100%', paddingHorizontal: '5%'},
  dropdown1BtnStyle: {
    width: SCREEN_WIDTH - 40,
    // borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 15,
    borderBottomColor: 'grey',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
  },
  backgroundDisabled: {backgroundColor: colors.transparent},
  dropdown1BtnTxtStyle: {
    textAlign: 'left',
    fontFamily: fonts.Montserrat_Medium,
    fontSize: 16,
    // paddingLeft: 0,
  },
  dropdown1DropdownStyle: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    // height: 250,
  },
  dropdown1RowStyle: {
    backgroundColor: colors.white,
    borderBottomColor: colors.greyText,
  },
  dropdown1RowTxtStyle: {
    color: colors.text,
    textAlign: 'left',
    fontFamily: fonts.Montserrat_Medium,
  },
  divider: {width: 12},
});
export default Selector;
