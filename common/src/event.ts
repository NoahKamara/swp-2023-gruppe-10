
// export declare type Range<T> = {
//   lowerBound: T
//   upperBound: T
// }
export declare type EventFilter = {
  term?: string
  locations?: string[]

  startDate?: Date
  endDate?: Date

  minPrice?: number
  maxPrice?: number

  onlyFavorites?: boolean
}

export declare type EventListItem = {
  id: number,
  title: string,
  start_date: Date,
  end_date: Date,
  start_time: string
  end_time: string
  picture: string,
  price: number,
}

export declare interface Event extends EventListItem {
  id: number
  title: string
  start_date: Date
  end_date: Date
  start_time: string
  end_time: string
  location: string
  picture: string
  price: number
  description: string
  description_html: string,
}
