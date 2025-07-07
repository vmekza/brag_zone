import { Dimensions, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    // backgroundColor: COLORS.background,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -5,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  textBlock: {
    alignItems: 'flex-start',
  },
  brandSection: {
    alignItems: 'center',
    marginTop: height * 0.12,
  },
  appName: {
    fontSize: 42,
    fontWeight: '600',
    fontFamily: 'Helvetica Neue',
    color: COLORS.primary,
    letterSpacing: 1.5,
    marginBottom: 15,
  },
  tagLine: {
    fontSize: 20,
    color: COLORS.gray,
    letterSpacing: 1.2,
    textTransform: 'lowercase',
  },
  loginSection: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gray,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginBottom: 20,
    width: '83%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
  },
  termsText: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.gray,
    maxWidth: 280,
  },
});
