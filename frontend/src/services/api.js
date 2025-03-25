export const fetchDetailedCryptoData = async (crypto, start, end) => {
    try {
      const url = "http://127.0.0.1:5000/api/crypto/data";
      const data = {
        coin_name: crypto,
        start_date: start,
        end_date: end,
      };
      console.log("Data being sent:", JSON.stringify(data));
  
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      // Leer la respuesta como texto
      const responseText = await response.text();
  
      // Sanitizar la respuesta: reemplazar "Infinity" con null
      const sanitizedResponseText = responseText.replace(/"p_ratio":\s*Infinity/g, '"p_ratio": null');
  
      // Parsear la respuesta sanitizada como JSON
      const responseData = JSON.parse(sanitizedResponseText);
  
      if (response.ok) {
        return { data: responseData };
      } else {
        return { data: null };
      }
    } catch (error) {
      console.error("Error fetching detailed crypto data:", error);
      return { data: null };
    }
  };

export const fetchAllNames = async () => {
    try {
        const response = await fetch("http://127.0.0.1:5000/api/crypto/allNames");
        const data = await response.json();
        return {data: data};
    } catch (error) {
        console.error("Error fetching all names:", error);
        return { data: null };
    }
}

export const fetchCryptoByYear = async (year) => {
    try {
        const url = "http://127.0.0.1:5000/api/crypto/date"
        const data = {
            date: year
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (response.ok) {
            return {data: responseData};
        }
        else {
            throw new Error('Error fetching crypto by year');
        }
    }
    catch (error) {
        console.error("Error fetching crypto by year:", error);
        return { data: [] };
    }

}

export const fetchTopCryptosByYear = async (year) => {
    try {
        const url = "http://127.0.0.1:5000/api/crypto/graph_most_interesting"

        const data = {
            year: year
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (response.ok) {
            return {data: responseData};
        }
        else {
            throw new Error('Error fetching top cryptos by year');
        }
    }
    catch (error) {
        console.error("Error fetching top cryptos by year:", error);
        return { data: [] };
    }
}

export const fetchStats = async (year) => {
    try {
        const url = "http://127.0.0.1:5000/api/crypto/stats"
        const data = {
            year: year
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (response.ok) {
            return {data: responseData};
        }
        else {
            throw new Error('Error fetching stats');
        }
    }
    catch (error) {
        console.error("Error fetching stats:", error);
        return { data: [] };
    }
}

export const fetchVolatilityStats = async (year) => {
    try {
        const url = "http://127.0.0.1:5000/api/crypto/most_volatile_stable"
        const data = {
            year: year
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (response.ok) {
            return {data: responseData};
        }
        else {
            throw new Error('Error fetching volatility response');
        }

    }
    catch (error) {
        console.error("Error fetching volatility response:", error);
        return { data: [] };
    }
}