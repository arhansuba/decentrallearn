import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { Web3Provider } from './contexts/Web3Context';
import NavBar from './components/NavBar';
import Home from './components/Home';
import CourseList from './components/Course/CourseList';
import CourseContent from './components/Course/CourseContent';
import QuizComponent from './components/Quiz/QuizComponent';
import Profile from './components/UserProfile/Profile';
import Forum from './components/Community/Forum';
import SuggestionVoting from './components/Community/SuggestionVoting';

const App = () => {
  return (
    <Router>
      <UserProvider>
        <Web3Provider>
          <div className="app">
            <NavBar />
            <main className="content">
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/courses" component={CourseList} />
                <Route path="/courses/:courseId" component={CourseContent} />
                <Route path="/quiz/:courseId" component={QuizComponent} />
                <Route path="/profile" component={Profile} />
                <Route path="/forum" component={Forum} />
                <Route path="/suggestions" component={SuggestionVoting} />
              </Switch>
            </main>
          </div>
        </Web3Provider>
      </UserProvider>
    </Router>
  );
};

export default App;