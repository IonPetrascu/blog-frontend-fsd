import { reactive, toRefs } from 'vue';

const state = reactive({
  user: {
    username: '',
    bio: '',
  },
  loading: false,
  error: null,
});

const useUserProfile = () => {
  const setUser = (userData) => {
    state.user.username = userData.username;
    state.user.bio = userData.bio;
  };

  const setLoading = (isLoading) => {
    state.loading = isLoading;
  };

  const setError = (error) => {
    state.error = error;
  };

  const validateUserData = (data) => {
    return data.username && data.bio;
  };

  return {
    ...toRefs(state),
    setUser,
    setLoading,
    setError,
    validateUserData,
  };
};

export default useUserProfile;
