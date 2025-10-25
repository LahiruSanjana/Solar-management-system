const baseurl = 'http://localhost:8000/api';

export const getAllEnergyGenerationRecords = async (id) => {
    const res = await fetch(`${baseurl}/energy-generation-records/solar-unit/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(res);
    const data = await res.json();
    console.log(data);
    return data;
};
