
export declare type EventListItem = {
  id: number,
  title: string,
  start_date: Date,
  end_date: Date,
  picture: string,
  price: number
}

export declare interface Event extends EventListItem {
  id: number
  title: string
  start_date: Date
  end_date: Date
  location: string
  picture: string
  price: number
  description: string
  description_html: string
}
