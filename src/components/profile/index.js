import React, { Component } from "react";
import { allTeams } from "../../appConstants";
import fire from "../../fire";
import "./index.scss";

class Profile extends Component {
  constructor() {
    super();
    this.db = fire.firestore();
  }

  state = {
    currentIndex: 0,
    fullData: "",
    dataToDisplay: "",
    allData: "",
    isSold: false,
    isUnsoldSelected: true,
    isViewTeamsEnabled: false
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isUnsoldSelected !== this.state.isUnsoldSelected) {
      this.setState({
        currentIndex: 0,
        fullData: "",
        dataToDisplay: "",
        allData: "",
        isSold: false,
        isViewTeamsEnabled: false
      });
      this.fetchData();
    }
  }

  fetchData = () => {
    this.db
      .collection("players")
      .get()
      .then(querySnapshot => {
        const data = [];
        querySnapshot.forEach(doc => {
          data.push(doc.data());
        });
        const filteredData = data.filter(item => {
          if (this.state.isUnsoldSelected) {
            if (item.isSold === false && item.isPassed === false) {
              return item;
            }
          } else {
            if (item.isSold === true) {
              return item;
            }
          }
        });

        for (let i = 0; i < filteredData.length - 1; i++) {
          let j = i + Math.floor(Math.random() * (filteredData.length - i));
          const temp = filteredData[j];
          filteredData[j] = filteredData[i];
          filteredData[i] = temp;
        }

        this.setState({
          allData: data,
          fullData: filteredData,
          dataToDisplay: filteredData[0]
        });
      });

    this.setState({ teams: this.createTeamDetails() });
  };

  onNext = () => {
    if (this.state.currentIndex < this.state.fullData.length) {
      if (this.state.isUnsoldSelected === true) {
        const updatedValue = {
          ...this.state.dataToDisplay,
          isPassed: true
        };

        const self = this;
        this.db
          .collection("players")
          .doc(this.state.dataToDisplay.id.toString())
          .set(updatedValue, { merge: true })
          .then(function(docRef) {
            self.fetchData();
            this.setState({ a: 1 });
          })
          .catch(function(error) {
            console.error("Error adding document: ", error);
          });
      } else {
        this.setState({
          dataToDisplay: this.state.fullData[this.state.currentIndex + 1],
          currentIndex: this.state.currentIndex + 1,
          isSold: false
        });
      }
      // this.setState({
      //   dataToDisplay: this.state.fullData[this.state.currentIndex + 1],
      //   currentIndex: this.state.currentIndex + 1,
      //   isSold: false
      // });
      // this.fetchData();
    }
  };

  onPrevious = () => {
    if (this.state.currentIndex > 0) {
      this.setState({
        dataToDisplay: this.state.fullData[this.state.currentIndex - 1],
        currentIndex: this.state.currentIndex - 1,
        isSold: false
      });
    }
  };

  onAdd = value => {
    const updatedValue = {
      ...this.state.dataToDisplay,
      currentPrice: this.state.dataToDisplay.currentPrice + value
    };
    this.setState({ dataToDisplay: updatedValue });
  };

  onSubtract = value => {
    const subtractedValue = this.state.dataToDisplay.currentPrice - value;
    if (subtractedValue >= this.state.dataToDisplay.basePrice) {
      const updatedValue = {
        ...this.state.dataToDisplay,
        currentPrice: subtractedValue
      };
      this.setState({ dataToDisplay: updatedValue });
    }
  };

  onTeamSelection = teamObject => {
    /* to save team selection starts here */
    const updatedValue = {
      ...this.state.dataToDisplay,
      teamIcon: teamObject.imgSrc,
      teamSoldTo: teamObject.name,
      isSold: true,
      isPassed: true
    };

    const self = this;
    this.db
      .collection("players")
      .doc(this.state.dataToDisplay.id.toString())
      .set(updatedValue, { merge: true })
      .then(function(docRef) {
        self.fetchData();
        this.setState({ a: 1 });
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
    /* to save team selection ends here */

    /* to load data into firebase uncomment from the line below */
    // const x = [
    //     {
    //       "id": 1,
    //       "photoPath": "images/sachin.jpeg",
    //       "name": "Sachin",
    //       "flat": "Y-004",
    //       "type": "All Rounder",
    //       "lastYear": true,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 400,
    //       "currentPrice": 400,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 2,
    //       "photoPath": "images/Avishek L 604 - BBW.jpg",
    //       "name": "Avishek",
    //       "flat": "L-604",
    //       "type": "All Rounder",
    //       "lastYear": true,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 300,
    //       "currentPrice": 300,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 3,
    //       "photoPath": "images/mayank.jpeg",
    //       "name": "Mayank",
    //       "flat": "L-902",
    //       "type": "All Rounder",
    //       "lastYear": true,
    //       "isSold": true,
    //       "isPassed": true,
    //       "basePrice": 2000,
    //       "currentPrice": 2000,
    //       "teamSoldTo": "Mogambo",
    //       "teamIcon": "images/Team_mogambo.jpeg"
    //     },
    //     {
    //       "id": 4,
    //       "photoPath": "images/Shubham L 303 - BBW.jpg",
    //       "name": "Shubham",
    //       "flat": "L-303",
    //       "type": "All Rounder",
    //       "lastYear": true,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 300,
    //       "currentPrice": 300,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 5,
    //       "photoPath": "images/Gaurag J 502 - BB.jpg",
    //       "name": "Gaurang",
    //       "flat": "J-602",
    //       "type": "All Rounder",
    //       "lastYear": true,
    //       "isSold": true,
    //       "isPassed": true,
    //       "basePrice": 2000,
    //       "currentPrice": 2000,
    //       "teamSoldTo": "Fukrey",
    //       "teamIcon": "images/Team_fukrey.jpeg"
    //     },
    //     {
    //       "id": 6,
    //       "photoPath": "images/Raman J 004 - BB.jpg",
    //       "name": "Raman",
    //       "flat": "J-004",
    //       "type": "Batsman",
    //       "lastYear": true,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 300,
    //       "currentPrice": 300,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 7,
    //       "photoPath": "images/Rijul O 403 - BBU.jpg",
    //       "name": "Rijul",
    //       "flat": "L-1104",
    //       "type": "All Rounder",
    //       "lastYear": true,
    //       "isSold": true,
    //       "isPassed": true,
    //       "basePrice": 2000,
    //       "currentPrice": 2000,
    //       "teamSoldTo": "Warriors",
    //       "teamIcon": "images/Team_warriors.jpeg"
    //     },
    //     {
    //       "id": 8,
    //       "photoPath": "images/Pasta L 903 - BB.jpg",
    //       "name": " Shubham P",
    //       "flat": "L-903",
    //       "type": "All Rounder",
    //       "lastYear": true,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 300,
    //       "currentPrice": 300,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 9,
    //       "photoPath": "images/Deborat Z 504 - BB.jpg",
    //       "name": "Deborat",
    //       "flat": "Z-504",
    //       "type": "All Rounder",
    //       "lastYear": false,
    //       "isSold": true,
    //       "isPassed": true,
    //       "basePrice": 2000,
    //       "currentPrice": 2000,
    //       "teamSoldTo": "Bahubali",
    //       "teamIcon": "images/Team_bahubali.jpeg"
    //     },
    //     {
    //       "id": 10,
    //       "photoPath": "images/John Y 301 - BB.jpg",
    //       "name": "John",
    //       "flat": "Y-301",
    //       "type": "All Rounder",
    //       "lastYear": true,
    //       "isSold": true,
    //       "isPassed": true,
    //       "basePrice": 2000,
    //       "currentPrice": 2000,
    //       "teamSoldTo": "Dabangg",
    //       "teamIcon": "images/Team_dabang.jpeg"
    //     },
    //     {
    //       "id": 11,
    //       "photoPath": "images/ravi.jpeg",
    //       "name": "Ravi ",
    //       "flat": "L-601",
    //       "type": "Batsman",
    //       "lastYear": true,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 100,
    //       "currentPrice": 100,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 12,
    //       "photoPath": "images/Rahul Tiwari J 1103 - BB.jpg",
    //       "name": "Rahul Tiwari",
    //       "flat": "J-1103",
    //       "type": "Batsman",
    //       "lastYear": true,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 300,
    //       "currentPrice": 300,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 13,
    //       "photoPath": "images/Anuj J 1103 BB.jpg",
    //       "name": "Anuj Sirvastav",
    //       "flat": "J-1103",
    //       "type": "Batsman",
    //       "lastYear": true,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 100,
    //       "currentPrice": 100,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 14,
    //       "photoPath": "images/navneet.jpeg",
    //       "name": "Navneet",
    //       "flat": "L-503",
    //       "type": "Batsman",
    //       "lastYear": true,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 100,
    //       "currentPrice": 100,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 15,
    //       "photoPath": "images/Dharmendra J 1101 - BB.jpg",
    //       "name": "Dharmendar",
    //       "flat": "J-1101",
    //       "type": "All Rounder",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 300,
    //       "currentPrice": 300,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 16,
    //       "photoPath": "images/Srikant L 1104.jpg",
    //       "name": "Srikant",
    //       "flat": "L-1104",
    //       "type": "All Rounder",
    //       "lastYear": true,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 300,
    //       "currentPrice": 300,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 17,
    //       "photoPath": "images/ashutoshY503.jpeg",
    //       "name": "Ashutosh",
    //       "flat": "Y-503",
    //       "type": "All Rounder",
    //       "lastYear": true,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 300,
    //       "currentPrice": 300,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 18,
    //       "photoPath": "images/raj.jpeg",
    //       "name": "Raj",
    //       "flat": "Y-503",
    //       "type": "NA",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 100,
    //       "currentPrice": 100,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 19,
    //       "photoPath": "images/Karan M 904 -BBW.jpg",
    //       "name": "Karan",
    //       "flat": "M-904",
    //       "type": "All Rounder",
    //       "lastYear": true,
    //       "isSold": true,
    //       "isPassed": true,
    //       "basePrice": 2000,
    //       "currentPrice": 2000,
    //       "teamSoldTo": "Chhichore",
    //       "teamIcon": "images/Team_chichore.jpeg"
    //     },
    //     {
    //       "id": 20,
    //       "photoPath": "images/Avanish Y 204 - BB.jpg",
    //       "name": "Avanish",
    //       "flat": "Y-204",
    //       "type": "All Rounder",
    //       "lastYear": true,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 400,
    //       "currentPrice": 400,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 21,
    //       "photoPath": "images/Mohit K 302 - BB.jpg",
    //       "name": "Mohit Sharma",
    //       "flat": "K-302",
    //       "type": "All Rounder",
    //       "lastYear": false,
    //       "isSold": true,
    //       "isPassed": true,
    //       "basePrice": 2000,
    //       "currentPrice": 2000,
    //       "teamSoldTo": "Cobra",
    //       "teamIcon": "images/Team_cobra.jpeg"
    //     },
    //     {
    //       "id": 22,
    //       "photoPath": "images/K1001.jpg",
    //       "name": "Abhishek",
    //       "flat": "L-1001",
    //       "type": "All Rounder",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 300,
    //       "currentPrice": 300,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 23,
    //       "photoPath": "images/Gaurav N 203 BB.jpg",
    //       "name": "Gaurav",
    //       "flat": "N-203",
    //       "type": "Batsman",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 100,
    //       "currentPrice": 100,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 24,
    //       "photoPath": "images/K703.jpg",
    //       "name": "Amit",
    //       "flat": "K-703",
    //       "type": "NA",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 100,
    //       "currentPrice": 100,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 25,
    //       "photoPath": "images/Samik L 1001 - BB.jpg",
    //       "name": "Samik",
    //       "flat": "L-1001",
    //       "type": "Bowler",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 200,
    //       "currentPrice": 200,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 26,
    //       "photoPath": "images/Gaurav J 001 - BB.jpg",
    //       "name": "Gaurav Agarwal",
    //       "flat": "J-001",
    //       "type": "Batsman",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 100,
    //       "currentPrice": 100,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 27,
    //       "photoPath": "images/Udit J 802 - BW.jpg",
    //       "name": "Udit",
    //       "flat": "J-802",
    //       "type": "Batsman",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 100,
    //       "currentPrice": 100,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 28,
    //       "photoPath": "images/Y103.jpg",
    //       "name": "Aneesh",
    //       "flat": "Y-103",
    //       "type": "Batsman",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 100,
    //       "currentPrice": 100,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 29,
    //       "photoPath": "images/Pradeep N 102 - BB.jpg",
    //       "name": "Pradeep",
    //       "flat": "N-102",
    //       "type": "All Rounder",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 400,
    //       "currentPrice": 400,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 30,
    //       "photoPath": "images/vinay.jpeg",
    //       "name": "Vinay",
    //       "flat": "NA",
    //       "type": "Batsman",
    //       "lastYear": true,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 200,
    //       "currentPrice": 200,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 31,
    //       "photoPath": "images/Vivekanda J 202 - BB.jpg",
    //       "name": "Vivekananda",
    //       "flat": "J-202",
    //       "type": "Batsman",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 100,
    //       "currentPrice": 100,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 32,
    //       "photoPath": "images/Mohit N 104 - BB.jpg",
    //       "name": "MohitRTF",
    //       "flat": "N-104",
    //       "type": "All Rounder",
    //       "lastYear": true,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 400,
    //       "currentPrice": 400,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 33,
    //       "photoPath": "images/akhilesh.jpeg",
    //       "name": "Akhilesh",
    //       "flat": "Y-304",
    //       "type": "Bowler",
    //       "lastYear": true,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 100,
    //       "currentPrice": 100,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 34,
    //       "photoPath": "images/Vishal ex Am - BB.jpg",
    //       "name": "Vishal",
    //       "flat": "E-X-AM",
    //       "type": "All Rounder",
    //       "lastYear": true,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 400,
    //       "currentPrice": 400,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 35,
    //       "photoPath": "images/Uday O 1001 - BB.jpg",
    //       "name": "Uday",
    //       "flat": "O-1001",
    //       "type": "NA",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 100,
    //       "currentPrice": 100,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 36,
    //       "photoPath": "images/ajay.jpeg",
    //       "name": "Ajay",
    //       "flat": "Y-204",
    //       "type": "Bowler",
    //       "lastYear": true,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 300,
    //       "currentPrice": 300,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 37,
    //       "photoPath": "images/Ashutosh Y 204 - BBW.jpg",
    //       "name": "Ashutosh",
    //       "flat": "Y-204",
    //       "type": "NA",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 200,
    //       "currentPrice": 200,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 38,
    //       "photoPath": "images/M501.jpg",
    //       "name": "Anand",
    //       "flat": "M-501",
    //       "type": "Batsman",
    //       "lastYear": true,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 100,
    //       "currentPrice": 100,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 39,
    //       "photoPath": "images/Sanjay Z 201 - B.jpg",
    //       "name": "Sanjay Parsad",
    //       "flat": "Z-201",
    //       "type": "Batsman",
    //       "lastYear": true,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 300,
    //       "currentPrice": 300,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 40,
    //       "photoPath": "images/sunil.jpeg",
    //       "name": "Sunil N",
    //       "flat": "N-803",
    //       "type": "NA",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 200,
    //       "currentPrice": 200,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 41,
    //       "photoPath": "images/Rajat N 104.jpg",
    //       "name": "Rajat M",
    //       "flat": "N-104",
    //       "type": "All Rounder",
    //       "lastYear": true,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 300,
    //       "currentPrice": 300,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 42,
    //       "photoPath": "images/Gaurav L 701 - BBW.jpg",
    //       "name": "Gaurav B",
    //       "flat": "L-701",
    //       "type": "Batsman",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 100,
    //       "currentPrice": 100,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 43,
    //       "photoPath": "images/O002.jpg",
    //       "name": "Abhimanyu",
    //       "flat": "O-002",
    //       "type": "All Rounder",
    //       "lastYear": true,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 300,
    //       "currentPrice": 300,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 44,
    //       "photoPath": "images/Mohit L 702 BBF.jpg",
    //       "name": "Mohit",
    //       "flat": "L-702",
    //       "type": "Batsman",
    //       "lastYear": true,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 300,
    //       "currentPrice": 300,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 45,
    //       "photoPath": "images/Sumit Pathak - Ex AM - BB.jpg",
    //       "name": "Sumit",
    //       "flat": "E-x-AM",
    //       "type": "All Rounder",
    //       "lastYear": true,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 200,
    //       "currentPrice": 200,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 46,
    //       "photoPath": "images/Sid - O 1001 - BB.jpg",
    //       "name": "Sid",
    //       "flat": "O-1003",
    //       "type": "Bowler",
    //       "lastYear": true,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 200,
    //       "currentPrice": 200,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 47,
    //       "photoPath": "images/agr.jpeg",
    //       "name": "Agranshu",
    //       "flat": "J-001",
    //       "type": "All Rounder",
    //       "lastYear": true,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 400,
    //       "currentPrice": 400,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 48,
    //       "photoPath": "images/Vasant L 501 - BB.jpg",
    //       "name": "Vasant",
    //       "flat": "L-501",
    //       "type": "Batsman",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 100,
    //       "currentPrice": 100,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 49,
    //       "photoPath": "images/playerphoto.jpg",
    //       "name": "Praveen",
    //       "flat": "NA",
    //       "type": "NA",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 100,
    //       "currentPrice": 100,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 50,
    //       "photoPath": "images/ankitM301.jpeg",
    //       "name": "Ankit",
    //       "flat": "M-301",
    //       "type": "All Rounder",
    //       "lastYear": true,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 400,
    //       "currentPrice": 400,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 51,
    //       "photoPath": "images/Yogendra - Ex AM - ALL.jpg",
    //       "name": "Yoginder",
    //       "flat": "E-x-AM",
    //       "type": "All Rounder",
    //       "lastYear": true,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 200,
    //       "currentPrice": 200,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 52,
    //       "photoPath": "images/rohan.jpeg",
    //       "name": "Rohan",
    //       "flat": "N-603",
    //       "type": "NA",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 100,
    //       "currentPrice": 100,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 53,
    //       "photoPath": "images/Ankush J 502 BB.jpg",
    //       "name": "Ankush",
    //       "flat": "J-502",
    //       "type": "Bowler",
    //       "lastYear": true,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 300,
    //       "currentPrice": 300,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 54,
    //       "photoPath": "images/prabha.jpeg",
    //       "name": "Prabhakaran",
    //       "flat": "o-604",
    //       "type": "Batsman",
    //       "lastYear": true,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 200,
    //       "currentPrice": 200,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 55,
    //       "photoPath": "images/Rahul L 101 - BB.jpg",
    //       "name": "Rahul ",
    //       "flat": "L-101",
    //       "type": "NA",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 100,
    //       "currentPrice": 100,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 56,
    //       "photoPath": "images/Praveeb M 401 BB.jpg",
    //       "name": "Praveen",
    //       "flat": "M-401",
    //       "type": "Batsman",
    //       "lastYear": true,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 300,
    //       "currentPrice": 300,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 57,
    //       "photoPath": "images/Vignaraj J 304.jpg",
    //       "name": "Viganraj",
    //       "flat": "J-304",
    //       "type": "Batsman",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 200,
    //       "currentPrice": 200,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 58,
    //       "photoPath": "images/L804.jpg",
    //       "name": "Akshay",
    //       "flat": "L-804",
    //       "type": "Batsman",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 100,
    //       "currentPrice": 100,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 59,
    //       "photoPath": "images/Shekhar J 103 BB.jpg",
    //       "name": "Shekhar",
    //       "flat": "J-103",
    //       "type": "All Rounder",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 200,
    //       "currentPrice": 200,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 60,
    //       "photoPath": "images/Vinod L 602 - BB.jpg",
    //       "name": "Vinod",
    //       "flat": "L-602",
    //       "type": "Batsman",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 200,
    //       "currentPrice": 200,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 61,
    //       "photoPath": "images/playerphoto.jpg",
    //       "name": "Sandeep",
    //       "flat": "Z-504",
    //       "type": "NA",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 100,
    //       "currentPrice": 100,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 62,
    //       "photoPath": "images/rahulM104.jpeg",
    //       "name": "Rahul",
    //       "flat": "M-104",
    //       "type": "NA",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 200,
    //       "currentPrice": 200,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 63,
    //       "photoPath": "images/Deepak Jha Y 502.jpg",
    //       "name": "Deepak",
    //       "flat": "Y-502",
    //       "type": "NA",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 100,
    //       "currentPrice": 100,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 64,
    //       "photoPath": "images/Shashank L 903 - BB.jpg",
    //       "name": "Shashank",
    //       "flat": "L-903",
    //       "type": "Batsman",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 200,
    //       "currentPrice": 200,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 65,
    //       "photoPath": "images/L903.jpg",
    //       "name": "Aman",
    //       "flat": "L-903",
    //       "type": "NA",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 100,
    //       "currentPrice": 100,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 66,
    //       "photoPath": "images/Avishek Mohanty K101 BB.jpg",
    //       "name": "Avhishek Mohnaty",
    //       "flat": "k-101",
    //       "type": "All Rounder",
    //       "lastYear": true,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 200,
    //       "currentPrice": 200,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 67,
    //       "photoPath": "images/Rishu M 402 - BB.jpg",
    //       "name": "Rishu",
    //       "flat": "M-402",
    //       "type": "Batsman",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 200,
    //       "currentPrice": 200,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 68,
    //       "photoPath": "images/Rakesh N 104 BB.jpg",
    //       "name": "Rakesh",
    //       "flat": "N-104",
    //       "type": "All Rounder",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 400,
    //       "currentPrice": 400,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 69,
    //       "photoPath": "images/AnkitL202.jpeg",
    //       "name": "Ankit",
    //       "flat": "N-202",
    //       "type": "NA",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 100,
    //       "currentPrice": 100,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 70,
    //       "photoPath": "images/playerphoto.jpg",
    //       "name": "Sumit",
    //       "flat": "J-002",
    //       "type": "NA",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 200,
    //       "currentPrice": 200,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 71,
    //       "photoPath": "images/Prathvee L 903.jpg",
    //       "name": "Prathvee",
    //       "flat": "L-903",
    //       "type": "Batsman",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 100,
    //       "currentPrice": 100,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 72,
    //       "photoPath": "images/Nitesh L 903.jpg",
    //       "name": "Nitesh",
    //       "flat": "L-903",
    //       "type": "NA",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 100,
    //       "currentPrice": 100,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 73,
    //       "photoPath": "images/chakshu.jpeg",
    //       "name": "Chakshu",
    //       "flat": "J-502",
    //       "type": "All Rounder",
    //       "lastYear": true,
    //       "isSold": true,
    //       "isPassed": true,
    //       "basePrice": 2000,
    //       "currentPrice": 2000,
    //       "teamSoldTo": "Sultan",
    //       "teamIcon": "images/Team_sultan.jpeg"
    //     },
    //     {
    //       "id": 74,
    //       "photoPath": "images/Saurabh M 001 - BB.jpg",
    //       "name": "Saurabh",
    //       "flat": "M-001",
    //       "type": "Batsman",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 100,
    //       "currentPrice": 100,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     },
    //     {
    //       "id": 75,
    //       "photoPath": "images/sumitL1001.jpeg",
    //       "name": "Sumit",
    //       "flat": "L-1001",
    //       "type": "All Rounder",
    //       "lastYear": false,
    //       "isSold": false,
    //       "isPassed": false,
    //       "basePrice": 100,
    //       "currentPrice": 100,
    //       "teamSoldTo": "",
    //       "teamIcon": ""
    //     }
    //   ];

    // x.forEach(i => {
    // this.db
    // .collection("players").doc(i.id.toString())
    // .set(
    // i, { merge: true }
    // )
    // .then(function (docRef) {
    // console.log("Document written with ID: ", docRef.id);
    // })
    // .catch(function (error) {
    // console.error("Error adding document: ", error);
    // });
    // });
    /* to load data into firebase uncomment till the line above */
  };

  passedToUnsold = () => {
    if (this.state.allData) {
      const dataLength = this.state.allData.filter(
        i => i.isSold === false && i.isPassed === true
      ).length;

      if (dataLength > 0) {
        this.state.allData.forEach(i => {
          if (i.isSold === false && i.isPassed === true) {
            const updatedValue = {
              ...i,
              isPassed: false
            };

            this.db
              .collection("players")
              .doc(i.id.toString())
              .set(updatedValue, { merge: true })
              .then(function(docRef) {})
              .catch(function(error) {
                console.error("Error adding document: ", error);
              });
          }
        });
        this.fetchData();
      }
    }
  };

  viewTeams = () => {
    this.createTeamDetails();
    this.setState({ isViewTeamsEnabled: !this.state.isViewTeamsEnabled });
  };

  createTeamDetails = () => {
    let arr = [];
    this.db
      .collection("players")
      .get()
      .then(querySnapshot => {
        const data = [];
        querySnapshot.forEach(doc => {
          data.push(doc.data());
        });
        const teamNames = allTeams.map(x => x.name);
        teamNames.forEach(x => {
          const teamWiseDetails = data.filter(y => {
            if (x === y.teamSoldTo) {
              return y;
            }
          });

          let balance = 10000;
          let playersInTeam = [];
          teamWiseDetails.forEach(i => {
            playersInTeam.push(i.name);
            balance -= i.currentPrice;
          });

          const singleTeam = teamWiseDetails.map(z => {
            return (
              <section key={z.teamSoldTo} title={z.teamSoldTo}>
                <div>
                  <img src={z.teamIcon}></img>
                  <div>
                    <div>{z.teamSoldTo}</div>
                    <div className="balance">₹ {balance} remaining </div>
                  </div>
                </div>
                <p>
                  {playersInTeam.map((p, index) => {
                    return <p key={p}>{`${index + 1}. ${p}`}</p>;
                  })}
                </p>
              </section>
            );
          });
          arr.push(singleTeam[0]);
        });
        this.setState({ teams: arr });
      });
  };

  render() {
    const {
      dataToDisplay,
      isUnsoldSelected,
      allData,
      isViewTeamsEnabled,
      isSold
    } = this.state;

    return (
      <section className="profile">
        <section className="action">
          <div>
            <div className="filter">
              <div
                className={
                  isUnsoldSelected === false &&
                  dataToDisplay &&
                  dataToDisplay.isSold
                    ? "active-filter sold"
                    : "sold"
                }
                onClick={() => this.setState({ isUnsoldSelected: false })}
              >
                <i className="fa fa-filter" aria-hidden="true"></i> SOLD{" "}
                {allData
                  ? `(${
                      allData.filter(
                        i => i.isSold === true && i.isPassed === true
                      ).length
                    })`
                  : ""}
              </div>
              <div
                className={
                  isUnsoldSelected === true &&
                  dataToDisplay &&
                  !dataToDisplay.isSold
                    ? "active-filter unsold"
                    : "unsold"
                }
                onClick={() => this.setState({ isUnsoldSelected: true })}
              >
                <i className="fa fa-filter" aria-hidden="true"></i> UNSOLD{" "}
                {allData
                  ? `(${
                      allData.filter(
                        i => i.isSold === false && i.isPassed === false
                      ).length
                    })`
                  : ""}
              </div>
              <div className="move" onClick={() => this.passedToUnsold()}>
                <i className="fa fa-bolt" aria-hidden="true"></i> Move{" "}
                {allData
                  ? `${
                      allData.filter(
                        i => i.isSold === false && i.isPassed === true
                      ).length
                    }`
                  : ""}{" "}
                passed player to unsold{" "}
              </div>
            </div>
          </div>
        </section>
        {dataToDisplay ? (
          <section className="card">
            <section className="pricing">
              {isUnsoldSelected === false ? (
                <div className="pricing-blocks pricing-blocks-centered">
                  <div className="label">Final Price</div>
                  <div className="value">
                    <span className="rupee-icon">₹</span>
                    {dataToDisplay.currentPrice}
                  </div>
                </div>
              ) : (
                <React.Fragment>
                  <div className="pricing-blocks">
                    <div className="label">Base Price</div>
                    <div className="value">
                      <span className="rupee-icon">₹</span>
                      {dataToDisplay.basePrice}
                    </div>
                  </div>
                  <div className="pricing-blocks">
                    <div className="label">Current Price</div>
                    <div className="value">
                      <span className="rupee-icon">₹</span>
                      {dataToDisplay.currentPrice}
                    </div>
                  </div>
                </React.Fragment>
              )}
            </section>
            <div className="change-player">
              {isUnsoldSelected === false ? (
                <div
                  className="previous"
                  onClick={() => this.onPrevious()}
                  title="Previous"
                >
                  <i className="fa fa-arrow-left" aria-hidden="true"></i>
                </div>
              ) : (
                ""
              )}
              <div className="next" onClick={() => this.onNext()} title="Next">
                <i className="fa fa-arrow-right" aria-hidden="true"></i>
              </div>
            </div>
            <img src={dataToDisplay.photoPath} />
            <div>
              <div className="player-name">
                <div className="label">PLAYER</div>
                <div className="value value-name">
                  {dataToDisplay.name}
                  {isSold === true ? (
                    <img
                      className="sold"
                      src={
                        "https://freepngimg.com/thumb/sold_out/1-2-sold-out-png-picture-thumb.png"
                      }
                    ></img>
                  ) : (
                    ""
                  )}
                  {dataToDisplay.isSold === true ? (
                    <span>
                      <img
                        className="sold"
                        src={
                          "https://freepngimg.com/thumb/sold_out/1-2-sold-out-png-picture-thumb.png"
                        }
                      ></img>
                      <img
                        className="sold-team"
                        src={dataToDisplay.teamIcon}
                      ></img>
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="other-info">
                  <div className="info-blocks">
                    <div className="label">FLAT</div>
                    <div className="value">{dataToDisplay.flat}</div>
                  </div>

                  <div className="info-blocks">
                    <div className="label">TYPE</div>
                    <div className="value">{dataToDisplay.type}</div>
                  </div>

                  <div className="info-blocks">
                    <div className="label">HISTORY</div>
                    <div className="value">
                      {dataToDisplay.lastYear ? "Yes" : "No"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {dataToDisplay.isSold ? (
              ""
            ) : (
              <section className="teams">
                {allTeams.map(team => {
                  return (
                    <img
                      key={team.id}
                      className="team-icons"
                      title={team.name}
                      src={team.imgSrc}
                      onClick={() => this.onTeamSelection(team)}
                    />
                  );
                })}
                <div
                  className="increment-button view-team"
                  onClick={() => this.viewTeams()}
                >
                  <i className="fa fa-eye" aria-hidden="true"></i> View teams
                </div>
                <div className="minus-container">
                  <div
                    className="increment-button"
                    onClick={() => this.onAdd(100)}
                  >
                    ₹ 100
                  </div>
                  <i
                    className="fa fa-minus-circle minus"
                    aria-hidden="true"
                    onClick={() => this.onSubtract(100)}
                  ></i>
                </div>
                <div className="minus-container">
                  <div
                    className="increment-button"
                    onClick={() => this.onAdd(200)}
                  >
                    ₹ 200
                  </div>
                  <i
                    className="fa fa-minus-circle minus"
                    aria-hidden="true"
                    onClick={() => this.onSubtract(200)}
                  ></i>
                </div>
              </section>
            )}
          </section>
        ) : (
          <section className="no-data transition">
            <i className="fa fa-check-circle scale" aria-hidden="true"></i> You
            are all done, nothing here!
            <p>Navigate to appropriate filter for data</p>
          </section>
        )}

        {isViewTeamsEnabled ? (
          <div
            className="modal-like"
            title="Click anywhere to close"
            onClick={() => this.viewTeams()}
          >
            {this.state.teams}
          </div>
        ) : (
          ""
        )}
        <section className="credit">
          designed and developed by <span>Arijit Patra</span>
        </section>
      </section>
    );
  }
}

export default Profile;
