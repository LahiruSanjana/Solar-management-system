const baseurl = 'http://localhost:8000/api';

export const getAllSolarUnitsById = async (id) => {
  try {
    const res = await fetch(`${baseurl}/solar-units/${id}`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(res);
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};
