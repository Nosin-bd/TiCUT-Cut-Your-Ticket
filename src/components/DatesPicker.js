import React from 'react';
import { StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';

export default function DatesPicker({ date, setOpen, setDate, open }) {
  return (
    <DatePicker
        modal
        open={open}
        date={date}
        onConfirm={(date) => {
          setOpen(false)
          setDate(date)
        }}
        onCancel={() => {
          setOpen(false)
        }}
      />
  );
}

const styles = StyleSheet.create({
});
