<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { usePostsStore } from "@/stores/postsStore";
import { VMarkdownEditor } from "vue3-markdown";
import "vue3-markdown/dist/style.css";
import { useRoute } from 'vue-router';

const showFormPost = ref(true);
const title = ref<string>("");
const tags = ref<string>("");
const description = ref<string>("");
const previewImage = ref<string | null>(null);
const previewVideoPath = ref<string | null>(null);
const store = usePostsStore();
const inputImg = ref(null);
const inputVideo = ref(null);
const route = useRoute();
const isImageDeleted = ref(false);
const isVideoDeleted = ref(false);

const id = computed<number | null>(() => {
  const idValue = route.query.id;
  return idValue && !isNaN(Number(idValue)) ? +idValue : null;
});

onMounted(() => store.getPosts());

const handleSubmit = async () => {
  const file = inputImg.value?.files[0]
  const video = inputVideo.value?.files[0]



  const formData = new FormData();
  if (!title.value || !description.value) {
    return;
  }
  formData.append("title", title.value);
  formData.append("description", description.value);
  formData.append("tags", tags.value);

  if (file) {
    formData.append("file", file);
  }
  if (video) {
    formData.append("video", video);
  }

  try {
    const post = await store.createPost(formData);
    if (post) clearForm();
  } catch (error) {
    console.error("Error submitting the form:", error);
  }
};

const clearImage = () => {
  if (inputImg.value) {
    inputImg.value.value = "";
  }
  previewImage.value = null;
  isImageDeleted.value = true;
};

const clearVideo = () => {
  if (inputVideo.value) {
    inputVideo.value.value = "";
  }
  previewVideoPath.value = null;
  isVideoDeleted.value = true;
};

const clearForm = () => {
  clearImage();
  clearVideo();
  title.value = "";
  description.value = "";
};

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    previewImage.value = URL.createObjectURL(file);
    isImageDeleted.value = true;
  }
};
const handleVideoChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    previewVideoPath.value = URL.createObjectURL(file);
    isVideoDeleted.value = true;

  }
};

const updatePost = async () => {
  if (!id.value) return console.error('This post cannot be updated!');


  const img = inputImg.value?.files[0] || null;
  const video = inputVideo.value?.files[0] || null;

  const formData = new FormData();

  if (!title.value || !description.value) {
    return;
  }

  formData.append("title", title.value);
  formData.append("description", description.value);
  formData.append("tags", tags.value);

  if (isImageDeleted.value) {
    formData.append("deleteImage", "true");
  }

  if (img) {
    formData.append("img", img);
  }

  if (isVideoDeleted.value) {
    formData.append("deleteVideo", "true");
  }
  if (video) {
    formData.append("video", video);
  }

  const imgName = route.query.img;
  formData.append("imgName", imgName);

  const videoName = route.query.video;
  formData.append("videoName", videoName);

  try {
    await store.updatePost(formData, id.value);
  } catch (error) {
    console.error("Error submitting the form:", error);
  }

}

onMounted(() => {
  if (route.query.id) {
    title.value = route.query.title;
    previewImage.value = route.query.img !== null ? `http://localhost:3000/upload/images/${route.query.img}` : null;
    previewVideoPath.value = route.query.video;
    description.value = route.query.content;
    tags.value = route.query.tags?.join(',')
  }
});

</script>
<template>
  <div class="wrapper">
    <form class="form" v-if="showFormPost">
      <h3 class="title">Title post</h3>
      <input v-model="title" type="text" placeholder="Title of post" required />
      <h3 class="Tags">Tags</h3>
      <input v-model="tags" placeholder="frontend,backend,blockchain" type="text">
      <div class="wrapper-img">
        <h3 class="title">Image post</h3>
        <label v-if="!previewImage" class="label-file" for="input-file">Add image of post</label>
        <label v-else class="label-file" for="input-file">Change image of post</label>
        <img class="img-preview" :class="{ active: previewImage !== null }" v-if="previewImage !== null"
          :src="previewImage" alt="" />
        <input ref="inputImg" id="input-file" type="file" accept="image/jpeg, image/png ,image/jpg"
          @change="handleImageChange" />
        <button v-if="previewImage" type="button" @click="clearImage">
          Clear img
        </button>
      </div>
      <div class="wrapper-video">
        <h3 class="title">Image post</h3>
        <label class="label-video" for="input-video">
          <span v-if="!previewVideoPath">Add video</span>
          <span v-else>Change video</span>
        </label>
        <input accept="video/mp4" type="file" id="input-video" ref="inputVideo" @change="handleVideoChange" />
        <div v-if="previewVideoPath">
          <span class="video-path"> {{ previewVideoPath }}</span>
          <button class="btn-clear-video-path" @click="clearVideo">Delete video</button>
        </div>
      </div>
      <h3 class="title">Editor</h3>
      <VMarkdownEditor class="editor" v-model="description" locale="en" />
      <div v-if="!id" class="buttons">
        {{ id }}
        <button @click="clearForm" type="button">Cancel</button>
        <button @click="handleSubmit" type="button" v-if="!id">Add post</button>
      </div>
      <div v-else class="buttons">
        <button @click="clearForm" type="button">Cancel</button>
        <button @click="updatePost" type="button">Save updated post</button>
      </div>
    </form>
  </div>
</template>
<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-inline: 10px;
}

input,
textarea {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid var(--c-1);
  background: var(--white);
  font-size: 1.2em;
}

input:focus,
textarea:focus {
  outline: none;
  background: var(--c-3);
}

.buttons {
  display: flex;
  justify-content: space-evenly;
}

button {
  padding: 15px 10px;
  border-radius: 10px;
  font-size: 1em;
}

button[type="submit"] {
  background: var(--c-4);
}

button[type="button"] {
  background: var(--gray);
}

.img-preview {
  object-fit: cover;
  transition: all 4s ease;
  max-height: 500px;
  width: 100%;
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.img-preview.active {
  height: 400px;
  opacity: 1;
  transform: scale(1);
}

input[type="file"] {
  display: none;
}

.wrapper-img,
.wrapper-video {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
}

label {
  background: var(--c-2);
  padding: 10px;
  cursor: pointer;
  width: max-content;
  border-radius: 10px;
}

.editor {
  background: rgb(255, 250, 250) !important;
  height: 300px;
}

.view {
  border: 1px solid var(--c-4);
  border-radius: 10px;
  min-height: 100px;
  padding: 10px;
}

.video-path {
  clear: var(--c-3);
  margin-right: 10px;
}

.btn-clear-video-path {
  background: var(--c-3);
}
</style>
