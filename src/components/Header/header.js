import React from "react";
import "./header.css";
import logo from "../../photos/logo-white.png";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { useSelector, useDispatch } from "react-redux";
import { showActions } from "../../store/index";
import { StreamChat } from "stream-chat";
import Cookies from "universal-cookie";
import { useChatContext } from "stream-chat-react";
import { authenticationActions } from "../../store/index";

const navigation = [
  { name: "Home", page: "home", current: true },
  { name: "Friends", page: "friends", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Header = () => {
  const dispatch = useDispatch();
  const profileUrl = useSelector((state) => state.uploadImage.profileUrl);
  const removeToken = () => {
    dispatch(authenticationActions.token());
  };
  const setDisplayHomePage = (e) => {
    dispatch(showActions.displayHome(e));
  };
  const displayBasePage = () => {
    dispatch(showActions.displayHomeBase());
  };
  const setDisplaySearchPage = (e) => {
    dispatch(showActions.displaySearch(e));
  };
  const setDisplayViewProfile = (e) => {
    dispatch(showActions.displayViewProfile(e));
  };
  const displayPage = (page) => {
    console.log(page);
    if (page === "home") {
      displayBasePage();
      setDisplaySearchPage(false);
      setDisplayHomePage(true);
      setDisplayViewProfile(false);
    }

    if (page === "friends") {
      displayBasePage();
      setDisplayHomePage(false);
      setDisplaySearchPage(true);
      setDisplayViewProfile(false);
    }
  };

  const logout = () => {
    const apiKey = "zge5f39fgjv7";
    const client = StreamChat.getInstance(apiKey);
    removeToken();
    localStorage.removeItem("userIsLoggedIn");
    localStorage.removeItem("email");
    client.disconnectUser();
    window.location.reload();
  };

  return (
    <Disclosure as="nav" className="header">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <img
                    className="block lg:hidden h-12 w-auto"
                    src={logo}
                    alt="Logo"
                  />
                  <img
                    className="hidden lg:block h-8 w-auto logo-large"
                    src={logo}
                    alt="Workflow"
                  />
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4 m-auto">
                    {navigation.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          displayPage(item.page);
                        }}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-gray-300  hover:bg-gray-700 focus:bg-gray-700 focus:text-white"
                            : " hover:bg-gray-700 hover:text-white",
                          "block px-3 py-2 rounded-md text-base font-medium bg-gray-900 hover:text-white focus:bg-gray-700 focus:text-white text-gray-300"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 ">
                {/* Profile dropdown */}
                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full header-image header-image"
                        src={profileUrl}
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            onClick={() => {
                              displayPage("home");
                            }}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-black bg-white   hover:bg-gray-300"
                            )}
                          >
                            Your Profile
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            onClick={logout}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-black bg-white  hover:bg-gray-300"
                            )}
                          >
                            Sign out
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <p
                  key={item.name}
                  onClick={() => {
                    displayPage(item.page);
                  }}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block px-3 py-2 rounded-md text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </p>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
