import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type MainHeaderProps = {
  title?: string;
  onAddPress?: () => void;
};

export function MainHeader({ title = 'How Much In', onAddPress }: MainHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingTop: Math.max(insets.top, 8) }]}>
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>
        <Pressable
          onPress={onAddPress}
          style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
          hitSlop={8}
        >
          <Text style={styles.addIcon}>＋</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default MainHeader;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  row: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111111',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonPressed: {
    opacity: 0.7,
  },
  addIcon: {
    fontSize: 30,
    lineHeight: 30,
    color: '#666666',
    marginTop: -2,
  },
});
