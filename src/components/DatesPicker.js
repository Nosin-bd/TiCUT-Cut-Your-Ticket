import React from 'react';
import { StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';

export default function DatesPicker({ date, setOpen, open, onConfirm }) {
  return (
    <DatePicker
        modal
        open={open}
        date={date}
        mode={'date'}
        onConfirm={onConfirm}
        onCancel={() => {
          setOpen(false)
        }}
      />
  );
}

const styles = StyleSheet.create({
});
