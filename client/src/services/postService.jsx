import API from "../utils/api";

export const postService = {
  async createPost(postData) {
    try {
      const response = await API.post("/api/v1/posts", postData, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      });

      return {
        success: true,
        data: response.data,
        message: "Post created successfully",
      };
    } catch (error) {
      console.error("Error creating post:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create post",
        error: error.response?.data,
      };
    }
  },

  async getPostById(postId) {
    try {
      const response = await API.get(`/api/v1/posts/${postId}`);
      return {
        success: true,
        data: response.data,
        message: "Post fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching post:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch post",
        error: error.response?.data,
      };
    }
  },

  async updatePost(postId, postData) {
    try {
      const response = await API.put(`/api/v1/posts/${postId}`, postData, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      });
      return {
        success: true,
        data: response.data,
        message: "Post updated successfully",
      };
    } catch (error) {
      console.error("Error updating post:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update post",
        error: error.response?.data,
      };
    }
  },


};
