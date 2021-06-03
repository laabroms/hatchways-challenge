import axios from "axios";
import React, { useEffect, useState } from "react";

const App = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [tagSearch, setTagSearch] = useState("");
  const [toggle, setToggle] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    axios.get(`https://api.hatchways.io/assessment/students`).then((res) => {
      setData(res.data);
    });
  }, []);

  useEffect(() => {
    let arr = [];
    let tagArr = [];
    let inputArr = [];
    if (data.students) {
      for (let x = 0; x < data.students.length; x++) {
        let tagObj = {
          id: x,
          tags: ['']
        };
        let inputObj = {
          str: '',
        }
        arr.push(false);
        inputArr.push(inputObj);
        tagArr.push(tagObj);

      }
      setToggle(arr);
      setTagInput(inputArr);
      setTags(tagArr);

    }
  }, [data]);

  const handleTagInputChange = (e, id) => {
    let arr = [...tagInput];
    arr[id - 1] = e;
    setTagInput(arr);
  }

  const avg = (grades) => {
    let sum = 0;
    for (let x = 0; x < grades.length; x++) {
      sum += Number(grades[x]);
    }
    let tot = sum / grades.length;
    return tot;
  };


  const handleToggle = (id) => {
    let arr = [...toggle];

    let currVal = toggle[id-1];

    arr[id-1] = !currVal;
    setToggle(arr);
  };

  const handleTagAdd = (e, id) => {
    e.preventDefault();
     let arr = [...tags];

     let tag = tagInput[id-1];
     arr[id-1].tags.push(tag);

     setTags(arr);

     let tagArr = [...tagInput];
     let obj = {str: ''};
     tagArr[id - 1] = obj;

     setTagInput(tagArr);
  }

  return (
    <div className="data-container">
      <div className="col align-center input-container">
        <input
          type="text"
          className="input-field"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        ></input>
        <input
          type="text"
          className="input-field"
          placeholder="Search by tag"
          style={{ paddingTop: "1rem" }}
          value={tagSearch}
          onChange={(e) => setTagSearch(e.target.value)}
        ></input>
      </div>
      <div className="data">
        {data.students && tags && tags.length > 0
          ? data.students
              .filter(
                (val) =>
                  val.firstName
                    .toUpperCase()
                    .startsWith(search.toUpperCase()) ||
                  val.lastName.toUpperCase().startsWith(search.toUpperCase()) ||
                  (val.firstName.toUpperCase() + ' ' + val.lastName.toUpperCase()).startsWith(search.toUpperCase())
              )
              .filter((val) =>
                tags[val.id - 1].tags.some((val) =>
                  val.toUpperCase().startsWith(tagSearch.toUpperCase())
                )
              )
              .map((d, index) => (
                <div key={index}>
                  <div className="row data-info">
                    <img src={d.pic} alt="img" className="data-image" />
                    <div className="info-container">
                      <div className="toggle-button-container">
                        <button
                          type="button"
                          className="toggle-button"
                          onClick={() => {
                            handleToggle(d.id);
                          }}
                        >
                          <i
                            className={
                              toggle[d.id - 1] ? "fas fa-minus" : "fas fa-plus"
                            }
                          />
                        </button>
                      </div>
                      <div className="col">
                        <div className="name-container">
                          <h1>
                            {" "}
                            {d.firstName.toUpperCase()}{" "}
                            {d.lastName.toUpperCase()}
                          </h1>
                        </div>
                        <div className="col other-info-container">
                          <div className="info">Email: {d.email}</div>
                          <div className="info">Company: {d.company}</div>
                          <div className="info">Skill: {d.skill}</div>
                          <div className="info">Average: {avg(d.grades)}%</div>
                        </div>
                        <div className="row" style={{ marginLeft: "2rem" }}>
                          {tags[d.id - 1] && tags[d.id - 1].tags
                            ? tags[d.id - 1].tags
                                .slice(1)
                                .map((tag) => (
                                  <div className="tag-container">{tag}</div>
                                ))
                            : null}
                        </div>
                        {tagInput && tagInput[d.id - 1] ? (
                          <form
                            onSubmit={(e) => handleTagAdd(e, d.id)}
                            style={{ marginBottom: "3rem" }}
                          >
                            <input
                              type="text"
                              className="input-field input-field-small"
                              placeholder="Add a tag"
                              value={tagInput[d.id - 1].str}
                              onChange={(e) =>
                                handleTagInputChange(e.target.value, d.id)
                              }
                            ></input>
                            <input type="submit" style={{ display: "none" }} />
                          </form>
                        ) : null}

                        <div className={toggle[d.id - 1] ? "show" : "hide"}>
                          <div className="grade-container">
                            {d.grades.map((g, loc) => (
                              <div className="row-grade">
                                <div className="left subdiv">Test {loc}:</div>
                                <div className="right subdiv">{g}%</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          : null}
      </div>
    </div>
  );
};

export default App;
