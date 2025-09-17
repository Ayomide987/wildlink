import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme, typography } from '../utils/theme';

const BlogScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wildlife Blog</Text>
      <Text style={styles.subtitle}>Coming Soon!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  title: {
    ...typography.h3,
    color: theme.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.body1,
    color: theme.colors.textSecondary,
  },
});

export default BlogScreen; 