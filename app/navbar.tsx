import { Disclosure } from '@headlessui/react'
import { NavLink } from "react-router";

export default function NavBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <Disclosure
        as="nav"
        className="relative bg-gray-800/50 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10"
      >
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                    <NavLink
                      to="/"
                      className={({ isActive, isPending, isTransitioning }) =>
                        [
                          isPending ? "pending" : "",
                          isActive ? "rounded-md px-3 py-2 text-md font-medium bg-gray-950/50 text-white" : "rounded-md px-3 py-2 text-md font-medium text-gray-300 hover:bg-white/5 hover:text-white",
                          isTransitioning ? "transitioning" : "",
                        ].join(" ")
                      }
                    >
                      Solfege
                    </NavLink>
                    {/* <NavLink
                      to="/intervals"
                      className={({ isActive, isPending, isTransitioning }) =>
                        [
                          isPending ? "pending" : "",
                          isActive ? "rounded-md px-3 py-2 text-md font-medium bg-gray-950/50 text-white" : "rounded-md px-3 py-2 text-md font-medium text-gray-300 hover:bg-white/5 hover:text-white",
                          isTransitioning ? "transitioning" : "",
                        ].join(" ")
                      }
                    >
                      Intervals
                    </NavLink> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Disclosure>
    </header>
  );
}