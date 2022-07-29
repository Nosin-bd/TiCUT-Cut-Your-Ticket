import React from 'react';
import { StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';

export default function TimePicker({ setOpen, setTime, open }) {
  return (
    <DatePicker
        modal
        open={open}
        date={new Date()}
        mode={'time'}
        onConfirm={(time) => {
            var suffix = time.getHours() >= 12 ? "PM":"AM";
            var res = ((time.getHours() + 11) % 12 + 1) + ':' + time.getMinutes() + ' ' + suffix;
            setOpen(false)
            setTime(res)
        }}
        onCancel={() => {
          setOpen(false)
        }}
      />
  );
}

const styles = StyleSheet.create({
});
