const API_DOMAIN = "http://localhost:3000/";

const get = async (path) => {
  try {
      const response = await fetch(API_DOMAIN + path);

      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      return result;
  } catch (error) {
      console.error("Fetch error:", error);
      throw error;
  }
};

const getCartByUserId = async (path,userId) => {
  try {
    const response = await fetch(`${API_DOMAIN}${path}?userId=${userId}`);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
      console.error("Fetch error:", error);
      throw error;
  }
};

const getWithEmail = async (path, email) => {
  try {
    const response = await fetch(`${API_DOMAIN}${path}?email=${email}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

const post = async (path, data) => {
  try {
    const response = await fetch(`${API_DOMAIN}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    // Kiểm tra phản hồi HTTP
    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(errorDetails)}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error in POST request:', error);
    throw error;
  }
};


const del = async (path, id) => {
  const url = `${API_DOMAIN}${path}/${id}`;
  try {
    const response = await fetch(url, {
      method: "DELETE"
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error while deleting resource at ${url}:`, error);
    return { error: error.message };
  }
};
