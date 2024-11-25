import { CommonActions, StackActions, createNavigationContainerRef } from '@react-navigation/native'

export class NavService {
  static navigationRef = createNavigationContainerRef()

  static getNaviRef() {
    return this.navigationRef.current
  }

  static navigate<P extends {}>(name: string, params?: P) {
    NavService.getNaviRef()?.navigate(name as never, params as never)
  }

  static push<P extends {}>(name: string, params?: P) {
    NavService.getNaviRef()?.dispatch(StackActions.push(name, params))
  }

  static goBack() {
    NavService.getNaviRef()?.goBack()
  }

  static reset<P extends {}>(name: string, params?: P) {
    NavService.getNaviRef()?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name, params }],
      }),
    )
  }

  static replace<P extends {}>(name: string, params?: P) {
    NavService.getNaviRef()?.dispatch(StackActions.replace(name, params))
  }

  static isCurrentRoute(name: string) {
    const currentRoute = NavService.getNaviRef()?.getCurrentRoute()
    return currentRoute?.name === name
  }
}
